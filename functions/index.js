const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

admin.initializeApp();

setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

const DAILY_LIMIT_PER_USER = 5;
const DAILY_LIMIT_PER_IP = 15;

/**
 * Obtiene timestamp de hace 24 horas
 * @return {admin.firestore.Timestamp} Timestamp de hace 24 horas
 */
function getYesterdayTimestamp() {
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  return admin.firestore.Timestamp.fromDate(yesterday);
}

/**
 * Crea un post con validación de límites diarios
 */
exports.createPost = onCall(async (request) => {
  if (!request.auth) {
    throw new Error("No autenticado");
  }

  // 🔍 AGREGÁ ESTO PARA DEBUGGEAR
  logger.info("📦 Datos recibidos:", JSON.stringify(request.data));

  const uid = request.auth.uid;
  const userIP = request.rawRequest.ip;
  const {postData} = request.data;
  const yesterday = getYesterdayTimestamp();

  logger.info("📦 postData:", JSON.stringify(postData));

  try {
    // 1. Verificar límite por usuario
    const userPosts = await admin
        .firestore()
        .collection("posts")
        .where("userId", "==", uid)
        .where("createdAt", ">", yesterday)
        .get();

    if (userPosts.size >= DAILY_LIMIT_PER_USER) {
      const userMsg =
        `Usuario ${uid} alcanzó límite diario ` +
        `(${userPosts.size}/${DAILY_LIMIT_PER_USER})`;
      logger.warn(userMsg);
      const limitMsg =
        `Has alcanzado el límite de ` + `${DAILY_LIMIT_PER_USER} posts diarios`;
      throw new Error(limitMsg);
    }

    // 2. Verificar límite por IP
    const ipPosts = await admin
        .firestore()
        .collection("posts")
        .where("createdIP", "==", userIP)
        .where("createdAt", ">", yesterday)
        .get();

    if (ipPosts.size >= DAILY_LIMIT_PER_IP) {
      const ipMsg =
        `IP ${userIP} superó límite diario ` +
        `(${ipPosts.size}/${DAILY_LIMIT_PER_IP})`;
      logger.warn(ipMsg);
      throw new Error("Demasiadas publicaciones desde esta conexión hoy");
    }

    // 3. Validaciones básicas
    if (!postData.petName || !postData.species) {
      throw new Error("Faltan datos obligatorios");
    }

    // 4. Crear el post
    const completePostData = {
      ...postData,
      userId: uid,
      createdIP: userIP,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "available",
    };

    const docRef = await admin
        .firestore()
        .collection("posts")
        .add(completePostData);

    const createdMsg =
      `✅ Post creado: ${docRef.id} por ` + `usuario ${uid} desde IP ${userIP}`;
    logger.info(createdMsg);
    const userCountMsg =
      `   Posts hoy: ${userPosts.size + 1}/` +
      `${DAILY_LIMIT_PER_USER} (usuario)`;
    logger.info(userCountMsg);
    const ipCountMsg =
      `   Posts hoy: ${ipPosts.size + 1}/` + `${DAILY_LIMIT_PER_IP} (IP)`;
    logger.info(ipCountMsg);

    return {
      success: true,
      postId: docRef.id,
      remainingPosts: DAILY_LIMIT_PER_USER - userPosts.size - 1,
      remainingPostsIP: DAILY_LIMIT_PER_IP - ipPosts.size - 1,
    };
  } catch (error) {
    logger.error("❌ Error creando post:", error);
    throw error;
  }
});

/**
 * Verifica el límite de posts del usuario e IP
 */
exports.checkPostLimit = onCall(async (request) => {
  if (!request.auth) {
    throw new Error("No autenticado");
  }

  const uid = request.auth.uid;
  const userIP = request.rawRequest.ip;
  const yesterday = getYesterdayTimestamp();

  try {
    // Contar posts del usuario
    const userPosts = await admin
        .firestore()
        .collection("posts")
        .where("userId", "==", uid)
        .where("createdAt", ">", yesterday)
        .get();

    // Contar posts de la IP
    const ipPosts = await admin
        .firestore()
        .collection("posts")
        .where("createdIP", "==", userIP)
        .where("createdAt", ">", yesterday)
        .get();

    const checkMsg =
      `📊 Check límites - Usuario: ` +
      `${userPosts.size}/${DAILY_LIMIT_PER_USER}, IP: ` +
      `${ipPosts.size}/${DAILY_LIMIT_PER_IP}`;
    logger.info(checkMsg);

    return {
      user: {
        postsToday: userPosts.size,
        remaining: Math.max(0, DAILY_LIMIT_PER_USER - userPosts.size),
        limit: DAILY_LIMIT_PER_USER,
        canPost: userPosts.size < DAILY_LIMIT_PER_USER,
      },
      ip: {
        postsToday: ipPosts.size,
        remaining: Math.max(0, DAILY_LIMIT_PER_IP - ipPosts.size),
        limit: DAILY_LIMIT_PER_IP,
        canPost: ipPosts.size < DAILY_LIMIT_PER_IP,
      },
    };
  } catch (error) {
    logger.error("❌ Error verificando límite:", error);
    throw error;
  }
});
/**
 * Obtiene posts con rate limiting por IP
 */
exports.getPosts = onCall(async (request) => {
  try {
    const userIP = request.rawRequest.ip;
    const {limitCount = 5, lastDocId = null} = request.data;

    // Límites de seguridad
    const HOURLY_READ_LIMIT_PER_IP = 300;
    const MAX_POSTS_PER_REQUEST = 20;
    const safeLimit = Math.min(limitCount, MAX_POSTS_PER_REQUEST);

    // Usar IP como ID del documento (sanitizar para Firestore)
    const sanitizedIP = userIP.replace(/[^a-zA-Z0-9]/g, "_");
    const rateLimitDoc = admin
        .firestore()
        .collection("read_logs")
        .doc(sanitizedIP);

    // Obtener o crear el documento de rate limit
    const rateLimitSnap = await rateLimitDoc.get();
    const now = admin.firestore.Timestamp.now();
    const oneHourAgo = admin.firestore.Timestamp.fromMillis(
        now.toMillis() - 60 * 60 * 1000,
    );

    let callCount = 0;
    let lastReset = now;

    if (rateLimitSnap.exists) {
      const data = rateLimitSnap.data();
      lastReset = data.lastReset;

      // Si pasó más de 1 hora, resetear contador
      if (lastReset.toMillis() < oneHourAgo.toMillis()) {
        callCount = 1;
        lastReset = now;
      } else {
        // Incrementar contador
        callCount = data.callCount + 1;
      }
    } else {
      // Primera llamada de esta IP
      callCount = 1;
    }

    // Verificar límite
    if (callCount > HOURLY_READ_LIMIT_PER_IP) {
      throw new Error(
          "Demasiadas consultas desde esta conexión. Intenta más tarde.",
      );
    }

    // Actualizar documento de rate limit
    await rateLimitDoc.set({
      ip: userIP,
      callCount: callCount,
      lastReset: lastReset,
      lastCall: now,
    });

    // Obtener posts
    let postsQuery = admin
        .firestore()
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(safeLimit);

    if (lastDocId) {
      const lastDoc = await admin
          .firestore()
          .collection("posts")
          .doc(lastDocId)
          .get();
      if (lastDoc.exists) {
        postsQuery = postsQuery.startAfter(lastDoc);
      }
    }

    const postsSnapshot = await postsQuery.get();
    const posts = [];
    postsSnapshot.forEach((doc) => {
      posts.push({id: doc.id, ...doc.data()});
    });

    const hasMore = posts.length === safeLimit;
    const newLastDocId = posts.length > 0 ? posts[posts.length - 1].id : null;

    console.log(
        `✅ IP ${userIP}: Llamada ${callCount}/${HOURLY_READ_LIMIT_PER_IP}`,
    );

    return {
      success: true,
      posts,
      hasMore,
      lastDocId: newLastDocId,
    };
  } catch (error) {
    console.error("❌ Error obteniendo posts:", error);
    throw error;
  }
});

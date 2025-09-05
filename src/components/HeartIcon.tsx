import React from "react";
import Svg, { Path } from "react-native-svg";

interface HeartIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({
  size = 24,
  color = "white",
  filled = false,
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
    >
      {/* Path para corazón vacío (stroke) */}
      {!filled && (
        <Path
          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.566"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}

      {/* Path para corazón lleno (filled) */}
      {filled && (
        <Path
          d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z"
          fill={color}
        />
      )}
    </Svg>
  );
};

export default HeartIcon;

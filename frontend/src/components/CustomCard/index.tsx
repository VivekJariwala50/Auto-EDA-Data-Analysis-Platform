import React from "react";
import { Card } from "antd";

interface CustomCardProps {
  title?: string;
  width?: number | string;
  children: React.ReactNode;
  className?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title = "Insight",
  width = "100%",
  children,
  className = "",
}) => {
  return (
    <Card
      title={<span className="fw-bold text-dark">{title}</span>}
      className={`h-100 shadow-sm border-0 rounded-3 ${className}`}
      style={{ width }}
    >
      {children}
    </Card>
  );
};

export default CustomCard;

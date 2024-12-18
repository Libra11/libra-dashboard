/**
 * Author: Libra
 * Date: 2024-12-18 10:33:40
 * LastEditors: Libra
 * Description:
 */
import { LucideProps } from "lucide-react";
import * as Icons from "lucide-react";

interface IconProps extends LucideProps {
  name: keyof typeof Icons;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = Icons[name] as React.ComponentType<LucideProps>;
  return <LucideIcon {...props} />;
};

export default Icon;

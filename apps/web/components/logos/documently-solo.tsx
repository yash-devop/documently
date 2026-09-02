import { cn } from "../../lib/cn";

type DocumentySoloProps = React.ComponentProps<"svg"> & { className?: string };
export const DocumentlySolo = ({ className, ...rest }: DocumentySoloProps) => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
      {...rest}
    >
      <path
        d="M13.5 0V8.34326C13.5 10.1837 11.2434 11.0699 9.99109 9.72118L4.725 4.05M27 13.5H18.6567C16.8163 13.5 15.9301 11.2434 17.2788 9.99109L22.95 4.725M13.5 27V18.6567C13.5 16.8163 15.7566 15.9301 17.0089 17.2788L22.275 22.95M0 13.5L8.34326 13.5C10.1837 13.5 11.0699 15.7566 9.72118 17.0089L4.05 22.275"
        stroke="#2BD994"
        strokeWidth="4"
      />
    </svg>
  );
};

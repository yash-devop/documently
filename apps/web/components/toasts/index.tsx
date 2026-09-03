import { IconCircleCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import React from "react";
import { Action, ExternalToast, ToastT, toast as sonnerToast } from "sonner";
type ToastType = Extract<
  ToastT["type"],
  "success" | "error" | "warning" | "info" | "default"
>;

type ToastInput = Omit<
  ExternalToast,
  "id" | "jsx" | "delete" | "promise" | "title" | "description"
> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  type?: ToastType;
};

type ToastProps = ToastInput & { id: number | string };

const ToastIcons: Record<ToastType, React.ReactNode> = {
  success: (
    <IconCircleCheck className="fill-emerald-500 text-white" size={20} />
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="fill-red-500 text-white"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  ),
  info: <IconInfoCircle className="text-white fill-blue-500" size={20} />,
  default: <></>,
  warning: <IconInfoCircle className="text-white fill-amber-500" size={20} />,
};

export const toast = (toast: ToastInput) => {
  return sonnerToast.custom((id) => {
    return (
      <Toast
        id={id}
        title={toast.title}
        description={toast.description}
        type={toast.type}
        action={toast.action}
        cancel={toast.cancel}
        dismissible={toast.dismissible}
        duration={toast.duration}
      />
    );
  });
};

const isAction = (value: unknown): value is Action => {
  return (
    typeof value === "object" &&
    value !== null &&
    !React.isValidElement(value) &&
    "label" in value &&
    "onClick" in value &&
    typeof (value as Action).onClick === "function"
  );
};

function Toast(props: ToastProps) {
  const { title, description, id, type } = props;
  const action = isAction(props.action) ? props.action : undefined;
  const cancel = isAction(props.cancel) ? props.cancel : undefined;

  return (
    <ToastRoot id={id} type={type}>
      <div className="w-full flex flex-col gap-3">
        <div className="w-full">
          {title && (
            <p className="text-sm font-medium text-foreground">{title}</p>
          )}
          {description && (
            <p className="mt-1 text-sm text-foreground-lighter">
              {description}
            </p>
          )}
        </div>
        {(action || cancel) && (
          <div className="flex items-center gap-3">
            {action && (
              <button
                type="button"
                className="text-xs font-medium text-blue-500 cursor-pointer"
                onClick={(event) => {
                  sonnerToast.dismiss(id);
                  action.onClick?.(event);
                }}
              >
                {action.label}
              </button>
            )}

            {cancel && (
              <button
                type="button"
                className="text-xs font-medium text-foreground-lighter cursor-pointer"
                onClick={(event) => {
                  cancel.onClick?.(event);
                  sonnerToast.dismiss(id);
                }}
              >
                {cancel.label}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastRoot>
  );
}

const ToastRoot = ({
  id,
  children,
  type = "default",
}: {
  id: number | string;
  children: React.ReactNode;
  type?: ToastType;
}) => {
  return (
    <div className="flex rounded-lg ring-1 ring-black/10 bg-white w-full min-w-91 md:max-w-91 items-center py-4 px-3 shadow font-geist-sans">
      <div className="flex flex-1 items-start gap-1.5">
        <div className="">{ToastIcons[type]}</div>
        {children}
        <IconX
          size={15}
          className="text-foreground-lighter cursor-pointer"
          onClick={() => sonnerToast.dismiss(id)}
        />
      </div>
    </div>
  );
};

export type { ToastInput, ToastType };

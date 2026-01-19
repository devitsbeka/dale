import { X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

type FeaturedCardImageProps = {
    title: string;
    description: string;
    confirmLabel: string;
    imageSrc: string;
    onConfirm: () => void;
    onDismiss: () => void;
    className?: string;
};

export const FeaturedCardImage = ({ title, description, confirmLabel, imageSrc, onConfirm, onDismiss, className }: FeaturedCardImageProps) => {
    return (
        <div className={cx("relative overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset", className)}>
            <div className="absolute top-3 right-3 z-10">
                <button
                    onClick={onDismiss}
                    className="flex size-7 items-center justify-center rounded-md bg-primary/80 text-fg-quaternary shadow-xs backdrop-blur-sm outline-focus-ring hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <X className="size-4" />
                </button>
            </div>

            <div className="aspect-[2/1] w-full overflow-hidden">
                <img src={imageSrc} alt={title} className="h-full w-full object-cover" />
            </div>

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-primary">{title}</h3>
                    <p className="text-sm text-tertiary">{description}</p>
                </div>

                <Button color="secondary" size="sm" onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

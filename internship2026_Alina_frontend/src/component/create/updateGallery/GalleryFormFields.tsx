interface GalleryFormFieldsProps {
  nameValue: string;
  onNameChange: (value: string) => void;
  descriptionValue: string;
  onDescriptionChange: (value: string) => void;
  nameLabel?: string;
  namePlaceholder?: string;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
  isDescriptionOptional?: boolean;
  errors?: {
    title?: string;
    description?: string;
  };
}


export const GalleryFormFields = ({
  nameValue,
  onNameChange,
  descriptionValue,
  onDescriptionChange,
  nameLabel = 'Name',
  namePlaceholder = 'Set name',
  descriptionLabel = 'Description',
  descriptionPlaceholder = 'Type here...',
  isDescriptionOptional = true,
  errors,
}: GalleryFormFieldsProps) => {
  return (
    <div className="flex flex-col gap-2 w-[311px] lg:w-[330px]">
      <div className="flex flex-col gap-3">
        <label className="text-tex-primary">
          {nameLabel}
        </label>
        <input
          type="text"
          value={nameValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value)}
          placeholder={namePlaceholder}
          required
          className={`w-full h-[50px] border rounded-2xl px-4 py-2 outline-none focus:border-accent
  ${errors?.title ? 'border-error' : 'border-border-input'}`}
        />
          {errors?.title && (
          <span className="text-error text-xs pl-1">
            {errors.title}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-tex-primary">
          {descriptionLabel}{" "}
          {isDescriptionOptional && (
            <span className="text-text-secondary">(Optional)</span>
          )}
        </label>
        <textarea
          value={descriptionValue}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onDescriptionChange(e.target.value)}
          placeholder={descriptionPlaceholder}
          rows={3}
          className={`w-full h-[100px] border rounded-2xl px-4 py-2 outline-none focus:border-accent
  ${errors?.title ? 'border-error' : 'border-border-input'}`}
        />
        {errors?.description && (
          <span className="text-error text-xs pl-1">
            {errors.description}
          </span>
        )}
      </div>
    </div>
  );
};

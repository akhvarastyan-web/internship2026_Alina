export const UploadZone = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="bg-pink w-[330px] h-[322px] flex flex-col gap-5">
        <div>
          <p className="text-[16px] font-bold leading-[150%]">Drag and grop photo here</p>
          <p className="text-[12px] leading-[150%]">JPEG, PNG (max 5MB / picture)</p>
        </div>

        <div className="flex items-center gap-[12px]">
          <div className="w-[75.5px] h-[1px] bg-black"></div>
          <p className="text-[16px] font-bold leading-[150%]">OR</p>
          <div className="w-[75.5px] h-[1px] bg-black"></div>
        </div>

        <button className="text-[14px] font-medium bg-accent border rounded">
        Upload
      </button>

      </div>
    </div>

  )
}

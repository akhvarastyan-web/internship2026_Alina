import React from 'react';
import { Camera } from 'lucide-react';

interface PhotoDropzoneProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhotoDropzone: React.FC<PhotoDropzoneProps> = ({ handleFileChange }) => {
  return (
    <div className="bg-accent-soft w-[311px] lg:w-[330px] h-[318px] lg:h-[322px] flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed border-gray-300 p-10 shrink-0">
      <div className="text-center">
        <p className="text-l leading-[150%] text-text-placeholder mb-1.5 lg:mb-2.5">Drag and drop photo here</p>
        <p className="text-xs leading-[150%] text-text-placeholder">JPEG, PNG (max 5MB / picture)</p>
      </div>
      <div className="flex items-center gap-3 w-full justify-center">
        <div className="w-[75.5px] h-[1px] bg-text-placeholder"></div>
        <p className="text-l text-text-placeholder">OR</p>
        <div className="w-[75.5px] h-[1px] bg-text-placeholder"></div>
      </div>
      <label className="w-[231px] lg:w-[258px] h-[50px] font-bold bg-accent text-bg-main border rounded-2xl cursor-pointer hover:bg-opacity-90 flex gap-2 items-center justify-center">
        <Camera className="w-6 h-6" />
        Upload
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

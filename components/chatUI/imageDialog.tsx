"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowsOut } from "@phosphor-icons/react";

type ImageDialogProps = {
  file: any | null;
};

export const ImageDialog: React.FC<ImageDialogProps> = ({ file }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const expandImage = () => {
    //{file ? file.src : '/brainF.png'}
    setSelectedImage("/brainF.png");
  };

  return (
    <Dialog>
      <DialogTrigger>
        <motion.div className="group cursor-pointer hover:cursor-pointer relative flex items-center justify-center px-1 rounded-md h-14 w-[60px] bg-mauve-200 border-[1px] border-purple-600">
          <Image
            src={"/brainF.png"}
            alt="Reference Image"
            width={60}
            height={56}
          />
          <Button
            className="bg-purple-400 shadow-none w-6 h-6 px-1 opacity-0 group-hover:opacity-100 group-hover:bg-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            size="icon"
            variant="outline"
            onClick={expandImage}
          >
            <ArrowsOut color="#793AAF" size={18} />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent>
        <Image
          src={selectedImage || "/brainF.png"}
          alt="Full Size Image"
          width={500}
          height={300}
        />
      </DialogContent>
    </Dialog>
  );
};

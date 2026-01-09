"use client";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/lib/react-aria-utils";

interface TagOption {
  label: string;
  value: string;
}

interface TagFilterProps {
  tags: TagOption[];
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
}

const filterButton = tv({
  extend: focusRing,
  base: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700",
});

const tagButton = tv({
  extend: focusRing,
  base: "rounded-full px-3 py-1.5 font-medium text-sm transition-colors",
  variants: {
    isSelected: {
      true: "bg-blue-600 text-white",
      false: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

const closeButton = tv({
  extend: focusRing,
  base: "flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100",
});

export function TagFilter({ tags, selectedTags, onTagChange }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (value: string) => {
    if (selectedTags.includes(value)) {
      onTagChange(selectedTags.filter((t) => t !== value));
    } else {
      onTagChange([...selectedTags, value]);
    }
  };

  const clearTags = () => {
    onTagChange([]);
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button className={filterButton()}>
        <Filter className="h-4 w-4" />
        絞り込み
        {selectedTags.length > 0 && (
          <span className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-xs">
            {selectedTags.length}
          </span>
        )}
      </Button>
      <ModalOverlay
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        isDismissable
      >
        <Modal className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
          <Dialog className="outline-none">
            {({ close }) => (
              <>
                <div className="flex items-center justify-between border-b p-4">
                  <h2 className="font-bold text-lg">タグで絞り込み</h2>
                  <Button
                    aria-label="閉じる"
                    className={closeButton()}
                    onPress={close}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Button
                        className={tagButton({
                          isSelected: selectedTags.includes(tag.value),
                        })}
                        key={tag.value}
                        onPress={() => toggleTag(tag.value)}
                      >
                        {tag.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between border-t bg-gray-50 p-4">
                  <Button
                    className="text-gray-600 text-sm hover:text-gray-900"
                    onPress={clearTags}
                  >
                    すべてクリア
                  </Button>
                  <Button className={filterButton()} onPress={close}>
                    適用
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

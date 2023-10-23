import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { ClassValue } from 'clsx';
import { useMemo } from 'react';
import { cn } from '../../lib/utils/cn';

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

type EditorProps = {
  defaultContent?: string;
  name?: string;
  editable?: boolean;
  className?: ClassValue;
  maxLength?: number;
};

export function Editor({
  defaultContent,
  editable = true,
  name,
  className,
  maxLength = 960,
}: EditorProps) {
  const defaultContentAsJSON = useMemo(() => {
    if (!defaultContent) return null;

    try {
      return JSON.parse(defaultContent);
    } catch (error) {
      console.error(error);
      return defaultContent;
    }
  }, [defaultContent]);

  const editor = useEditor({
    extensions,
    content: defaultContentAsJSON,
    editable,
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      if (content.length >= maxLength) {
        editor.commands.setContent(content.slice(0, maxLength));
      }
    },
  });

  return (
    <>
      <EditorContent
        className={cn(
          'prose min-w-full h-full text-foreground bg-background',
          className
        )}
        editor={editor}
        name={name}
      />

      {editable && (
        <input
          type="hidden"
          name={name}
          value={JSON.stringify(editor?.getJSON())}
        />
      )}
    </>
  );
}

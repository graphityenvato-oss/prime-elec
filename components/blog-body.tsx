"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import type { SerializedEditorState } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { nodes } from "@/components/blocks/editor-x/nodes";

type BlogBodyProps = {
  serializedState?: SerializedEditorState | null;
};

export function BlogBody({ serializedState }: BlogBodyProps) {
  if (!serializedState) {
    return null;
  }

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "BlogReadOnly",
        editable: false,
        theme: editorTheme,
        nodes,
        editorState: JSON.stringify(serializedState),
        onError: (error) => {
          console.error(error);
        },
      }}
    >
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-24 w-full rounded-2xl border border-border/60 bg-background p-5 text-base leading-7 text-foreground/85" />
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}

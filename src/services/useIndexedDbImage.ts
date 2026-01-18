import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { loadImage, saveImage } from "./imageStore";

export function useIndexedDBImage(key: string) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const revokeObjectURLIfNeeded = useEffectEvent(() => {
    if (url) URL.revokeObjectURL(url);
  });

  useEffect(() => {
    let revoked = false;

    loadImage(key).then((img) => {
      if (!img || revoked) return;

      setBlob(img);
      const objectUrl = URL.createObjectURL(img);
      setUrl(objectUrl);
      setLoading(false);
    });

    return () => {
      revoked = true;
      revokeObjectURLIfNeeded();
    };
  }, [key]);

  const save = useCallback(
    async (file: File) => {
      await saveImage(key, file);
      setBlob(file);

      if (url) URL.revokeObjectURL(url);
      setUrl(URL.createObjectURL(file));
    },
    [key, url],
  );

  return {
    blob,
    url,
    loading,
    save,
  };
}

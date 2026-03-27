export const extractFrameFromVideo = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      // Extrai um frame do meio do vídeo (ou no segundo 1)
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      
      let targetWidth = video.videoWidth;
      let targetHeight = video.videoHeight;
      const MAX_SIZE = 1024;

      if (targetWidth > MAX_SIZE || targetHeight > MAX_SIZE) {
        const ratio = Math.min(MAX_SIZE / targetWidth, MAX_SIZE / targetHeight);
        targetWidth *= ratio;
        targetHeight *= ratio;
      }

      // SDXL obriga múltiplos de 64 para não gerar artefatos abstratos
      canvas.width = Math.max(64, Math.round(targetWidth / 64) * 64);
      canvas.height = Math.max(64, Math.round(targetHeight / 64) * 64);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        reject(new Error('Falha ao criar contexto do canvas'));
      }
      URL.revokeObjectURL(video.src);
    };

    video.onerror = (e) => reject(e);
  });
};

export const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        let targetWidth = img.width;
        let targetHeight = img.height;
        const MAX_SIZE = 1024;

        if (targetWidth > MAX_SIZE || targetHeight > MAX_SIZE) {
          const ratio = Math.min(MAX_SIZE / targetWidth, MAX_SIZE / targetHeight);
          targetWidth *= ratio;
          targetHeight *= ratio;
        }

        // SDXL obriga múltiplos de 64 para não gerar artefatos abstratos
        canvas.width = Math.max(64, Math.round(targetWidth / 64) * 64);
        canvas.height = Math.max(64, Math.round(targetHeight / 64) * 64);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } else {
          reject(new Error('Falha no processamento do canvas'));
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

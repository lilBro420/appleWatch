const RNFS = {
  TemporaryDirectoryPath: '/tmp',
  downloadFile: ({ fromUrl, toFile }: { fromUrl: string; toFile: string }) => {
    console.log(`[Mock RNFS] Simulación de descarga desde ${fromUrl} a ${toFile}`);
    return {
      promise: Promise.resolve({ statusCode: 200 }),
    };
  },
};

export default RNFS;

module.exports = {
    css: {
        sourceMap: true,
        loaderOptions: {
            scss: {
                additionalData: `@import "~@/styles/_default.scss";`
            }
        }
    }
}

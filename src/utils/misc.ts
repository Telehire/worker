export default {
  /**
   * 判断是否是浏览器环境
   * @returns
   */
  isBrowser: (): boolean => !!(typeof window !== 'undefined' && window.document)
}

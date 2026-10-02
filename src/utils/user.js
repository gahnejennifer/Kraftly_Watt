export const firstName = (fullsname) => {
  if (!fullsname) return ''
  return fullsname.split(' ')[0]
}

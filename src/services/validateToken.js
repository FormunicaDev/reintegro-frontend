export default {
  logout() {
    setTimeout(() => {
      sessionStorage.removeItem('tknReiFormunica')
      sessionStorage.removeItem('userRei')
      sessionStorage.removeItem('roleRei')
      localStorage.removeItem('themeReintegro')
    }, 1500)
  },
}

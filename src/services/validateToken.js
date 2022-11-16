export default {
  logout() {
    setTimeout(() => {
      sessionStorage.removeItem('tknReiFormunica')
      sessionStorage.removeItem('userRei')
      sessionStorage.removeItem('roleRei')
    }, 1500)
  },
}

export const validateMove = (moveForm) => {
    return {
      address: moveForm.address.length > 0,
      zip: moveForm.zip && moveForm.zip.length === 5,
      city: moveForm.city && moveForm.city.length > 0,
      date: moveForm.date && moveForm.date.length > 0,
      contract: moveForm.contract && moveForm.contract.length > 0
    }
}
const URL = 'https://turuc.com.py/api/contribuyente/search';

export { getContribuyente };

function getContribuyente(search) {
  return fetch(`${URL}?search=${search}&page=0`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data.data)
    .catch(error => {
      throw error;
    });
}


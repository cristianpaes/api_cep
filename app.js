// Variables
const $cep = document.querySelector('#cep');
const $saida = document.querySelector('#saida');
const msg = {
  "cep_invalid": "O CEP informado é inválido.",
  "cep_notfound": "O CEP informado não existe!",
  "cep_error": "Ocorreu um erro ao realizar a consulta do CEP, tente novamente.",
};

// Listener for form search
document.querySelector('#search').addEventListener('submit', getcep);

// Listen for button close saida
document.querySelector("body").addEventListener("click", closesaida);


// Get cep
function getcep(event) {
  event.preventDefault();

  loading('on');

  if (!cepValidation($cep.value)) {
    loading('off');
    $saida.innerHTML = `
      <article class="message is-danger">
        <div class="message-header">
          <p>CEP: <strong>${$cep.value}</strong></p>
        </div>
        <div class="message-body">${msg.cep_invalid}</div>
      </article>
    `;
    $cep.focus();
    throw Error(msg.cep_invalid);
  }


  // Request cep using fetch API
  fetch(`https://viacep.com.br/ws/${$cep.value}/json/`)
  .then(response => {

    loading('off');

    if (response.status != 200) {
      $saida.innerHTML = `
        <article class="message is-danger">
          <div class="message-header">
            <p>CEP: <strong>${$cep.value}</strong></p>
          </div>
          <div class="message-body">${msg.cep_error}</div>
        </article>
      `;
      $cep.focus();
      throw Error(response.status);
    }
    else {
      return response.json();
    }
  })
  .then(data => {
    loading('off');

    if (data.erro) {
      $saida.innerHTML = `
      <article class="message is-warning">
        <div class="message-header">
          <p>CEP: <strong>${$cep.value}</strong></p>
        </div>
        <div class="message-body">${msg.cep_notfound}</div>
      </article>
      `;
      $cep.focus();
    }
    else {
      $saida.innerHTML = `
        <article class="message">
          <div class="message-header">
            <p>CEP: <strong>${$cep.value}</strong></p>
          </div>
          <div class="message-body">
            <ul>
              <li><strong>Endereço: </strong>${data.logradouro}</li>
              <li><strong>Complemento: </strong>${data.complemento}</li>
              <li><strong>Bairro: </strong>${data.bairro}</li>
              <li><strong>Cidade: </strong>${data.localidade}</li>
              <li><strong>Estado: </strong>${data.uf}</li>
            </ul>
          </div>
        </article>
      `;
    }
  })
  .catch(err => console.warn(err));
}

// cep validation
function cepValidation(value) {
  return /(^[0-9]{5}-[0-9]{3}$|^[0-9]{8}$)/.test(value) ? true : false;
}

// Close saida Container
function closesaida(event) {
  if (event.target.className == 'delete') {
    $saida.innerHTML = '';
    $cep.value = '';
    $cep.focus();
  }
}

// Loading
function loading(status) {
  let is_invisible = (status == 'on') ? '' : 'is-invisible';
  $saida.innerHTML = `
    <div class="has-text-centered">
      <span class="button is-white is-size-2 is-loading ${is_invisible}"></span>
    </div>
  `;
}

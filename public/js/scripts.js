// public/js/scripts.js
$(document).ready(function () {
    $('#portaCafe').hover(
      function () {
        // Ao passar o mouse
        $('#textoLetreiro').text('Entrar');
      },
      function () {
        // Ao remover o mouse
        $('#textoLetreiro').text('Bem-vindo');
      }
    );
  
    $('#portaCafe').click(function () {
      // Ao clicar na porta
      $('#loginModal').modal('show');
    });
  });
  
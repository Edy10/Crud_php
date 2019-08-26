$(document).ready(function(){
    /*--------------------------------------------------
     :: Buca medicamentos cadastrados
    -------------------------------------------------- */
    buscaMedicamento()
    /*--------------------------------------------------
     :: Busca e monta o campo "Empresa a qual pertence"
    -------------------------------------------------- */
    $.getJSON('buscaJson.php?tipo=01', function (data) {
		var options = '<option>Selecione</option>';
        if(data != 'null'){
            $.each(data, function (key, val) {
    			options += '<option value="' + val.cod + '">' + val.nome + '</option>';
    		});
    		$("#emp").html(options);
        }
	});
    /*--------------------------------------------------
     :: Limpa o formulário para um novo cadastro
    --------------------------------------------------*/
    $(".btn-novo").click(function(){
        $(".frm-inclusao").hide('3000');
        $(".frm-inclusao").show('1000');
        $('#frm-inclusao')[0].reset();
        $('.altera').removeClass('btn-warning').addClass('btn-primary');
    });
    /*--------------------------------------------------
     :: Busca medicamento cadastro
    --------------------------------------------------*/
    $("#btn-buscar").click(function(){
        if($("#codMedic").val() == ''){
            infoAlert('Favor informar o Código do medicamento', 'alert-warning');
        }else {
            buscaMedicamento($("#codMedic").val());
        }
    });
    /*--------------------------------------------------
     :: Executa o cadastro de medicamentos
    -------------------------------------------------- */
    $(".btn-incluir").click(function(){
        if(validaForm("#frm-inclusao")){
            var dados = $('#frm-inclusao').serialize() + '&tipo=01';
            $('.btn-incluir').attr("disabled", true);
            carregando(1);
            $.post('processa.php', dados, function(val){
                $('.btn-incluir').attr("disabled", false);
                carregando();
                if(val.sucesso){
                    $('#frm-inclusao')[0].reset();
                    buscaMedicamento();
                    infoAlert(val.sucesso, 'alert-success');
                }else if (val.erro) {
                    infoAlert(val.erro, 'alert-danger');
                }else{
                    infoAlert(val.alerta, 'alert-warning');
                }
            },"json");
        }
    });
    /*--------------------------------------------------
    :: Executa o processo editar medicamentos
   -------------------------------------------------- */
   $(this).on("click", "#altera", function(){
       var valores = $(this).val();
       var valDados = valores.split("||");
       //altera a cor do botao conforme click
       $('.altera').each(function(){
           if( this.value == valores ){
               $(this).removeClass('btn-primary').addClass('btn-warning');
           }else{
               $(this).removeClass('btn-warning').addClass('btn-primary');
           }
       });
       $("#codMedic").val(valDados[0]);
       $("#desc").val(valDados[1]);
       $("#apMedic").val(valDados[2]);
       $("#priAtivo").val(valDados[3]);
       $("#emp").val(valDados[4]);
   });
   /*--------------------------------------------------
   :: Executa o processo excluir medicamentos
  -------------------------------------------------- */
  $(this).on("click", "#excluir", function(){
      var codigo = $(this).val();
      var dados = 'codigo='+codigo+'&tipo=02';
      bootbox.confirm({
			message: "Tem certeza?",
			buttons: {
				confirm: {
					label: 'Sim',
					className: 'btn-success'
				},
				cancel: {
					label: 'Não',
					className: 'btn-danger'
				}
			},
			callback: function (result){
				if(result){
                    carregando(1);
                    $.post('processa.php', dados, function(val){
                        carregando();
                        if(val.sucesso){
                            buscaMedicamento();
                            infoAlert(val.sucesso, 'alert-success');
                        }else if (val.erro) {
                            infoAlert(val.erro, 'alert-danger');
                        }else{
                            infoAlert(val.alerta, 'alert-warning');
                        }
                    },"json");
				}
			}
		});
    });
});
/*--------------------------------------------------
 :: Function - Busca medicamentos cadastrados.
-------------------------------------------------- */
var buscaMedicamento = function(cod){
    $.getJSON('buscaJson.php?tipo=02&cod='+cod, function (data){
        var table = '';
        if(data.alerta){
            infoAlert(data.alerta, 'alert-warning');
        }else {
            if(data.length > 0){
                $(".relMedicamento").hide('3000');
                var table = '';
                $.each(data, function (key, val){
                    table += '<tr>';
                        table += '<td> <button class="btn btn-primary btn-xs altera" id="altera" value="'+val.dadosAlt+'"> <em class="glyphicon glyphicon-edit"></em></button> <button class="btn btn-danger btn-xs" id="excluir" value="'+val.codMedic+'"> <em class="glyphicon glyphicon-trash"></em></button> </td>';
                        table += '<td>' +val.codMedic+ '</td>';
                        table += '<td>' +val.desc+ '</td>';
                        table += '<td>' +val.apMedic+ '</td>';
                        table += '<td>' +val.priAtivo+ '</td>';
                        table += '<td>' +val.empNome+ '</td>';
                    table += '</tr>';
        		});
                $("#trMedi").html(table);
                $(".relMedicamento").show();
                $(".relMedicamento").show('1000');
            }else {
                $(".relMedicamento").hide();
            }
        }
	});
}
/*--------------------------------------------------
 :: Valida formulário
-------------------------------------------------- */
var validaForm = function( idForm ){
    var erroCampo = '';
    $(idForm + ' [required="true"]').each(function(){
        if( this.required ){
            var campo = $('label[for="'+this.name+'"]').html().split(':');
            if( this.value == '' || this.value == undefined ){
                erroCampo += campo[0].replace('* ', '') + '<br/>';
            }
        }
    });
    if( erroCampo != '' ){
        infoAlert('Favor preencher os campos abaixo:<br><br><ul>'+erroCampo+'<ul>', 'alert-warning');
        return false;
    }else{
        return true;
    }
}
/*--------------------------------------------------
 :: Function alert
-------------------------------------------------- */
var infoAlert = function(msg,tipo){
	$('.popupunder').show();
	var valor = '<div class="popupunder '+tipo+'"> <strong> <span class="glyphicon glyphicon-info-sign"></span> </strong>'+msg+'</div>';
	$("#alert").html(valor);
	window.setTimeout(function() {
		$(".popupunder").fadeTo(5000, 500).slideUp(500, function(){
		});
	}, 500);
}
/*--------------------------------------------------
 :: Function carregando
-------------------------------------------------- */
var carregando = function(tipo){
    if(tipo == 1){
        $('.modalCarregando').modal('show');
        $("#carregando").show();
    }else{
        $('.modalCarregando').modal('hide');
    }

}

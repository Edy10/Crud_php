<?php
/**
 * Salva , Altera e exclui os medicamentos
 *
 * @author Edivaldo S. Paix�o <esppaixao@gmail.com>
 * @param string $_POST com todas as informa��es do form
 * @return json $msg com retorno da a��o/mensagem realizada
 */
    session_start();
    $tem = 0;
    $parametros = filter_input_array( INPUT_POST, FILTER_DEFAULT );
    if($parametros['tipo'] == '01'){
        $posicao = $parametros['codMedic'];
        //Alimenta o cadastro na se��o
        if(!isset($_SESSION['valores'])):
            $_SESSION['valores'][$posicao] = $parametros;
            $msg['sucesso'] = utf8_encode("Medicamento cadastrado com sucesso.");
        else:
            $val = array_values($_SESSION['valores']);
            $vCount = count($val);
            //Verifica se o cadastro j� existe na se��o pelo c�digo do medicamento
            for ($i=0; $i < $vCount ; $i++) {
                if($val[$i]['codMedic'] == $posicao){
                    $tem ++;
                }
            }
            //Se n�o existe, cadastra um novo medicamento
            if($tem == 0){
                $_SESSION['valores'][$posicao] = $parametros;
                $msg['sucesso'] = utf8_encode("Medicamento cadastrado com sucesso.");
            }else {
                //Se existe, altera o medicamento cadastrado.
                $_SESSION['valores'][$posicao] = $parametros;
                $msg['sucesso'] = utf8_encode("Medicamento alterado com sucesso.");
            }
        endif;
    }else {
        //Exclui o medicamento conforme o c�digo passado.
        $codigo = $parametros ['codigo'];
        unset( $_SESSION['valores'][$codigo]);
        $msg['sucesso'] = utf8_encode("Medicamento exclu�do com sucesso.");
    }
    echo json_encode($msg);

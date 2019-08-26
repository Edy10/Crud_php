<?php
/**
 * Retorno Json dos medicamentos cadastrados
 *
 * @author Edivaldo S. Paixão <esppaixao@gmail.com>
 * @return json $json com a informações
 */
    session_start();
    //session_destroy();
    $tipo = (isset($_GET['tipo'])) ? $_GET['tipo'] : '';
    $encontrou = 0;
    $json = array();
    //Array das empresa a qual pertence
    $empresa = array(array("nome" => "Althaia", "cod" => 01),
                     array("nome" => "Equaliv", "cod" => 02)
                    );

    if($tipo == '01'){ //Monta o json select Empresa a qual pertence
        foreach ($empresa as $key => $value) {
            $json[$key]['nome'] = utf8_encode($value['nome']);
            $json[$key]['cod']  = $value['cod'];
        }
    }elseif($tipo == '02') { // Monta o json com a busca dos medicamentos cadastrados.
        $codigo = (isset($_GET['cod'])) ? $_GET['cod'] : '';

        if(isset($_SESSION['valores'])):
            $dados = array_values($_SESSION['valores']);

            if($codigo == 'undefined' || $codigo == ''){
                //Carrega todos os medicamentos.
                foreach ($dados as $key => $value) {
                    foreach ($empresa as $keyEmp => $valueEmp) {
                        if($valueEmp['cod'] == $value['emp']){
                            $json[$key]['empNome'] = $valueEmp['nome'];
                        }
                    }
                    $json[$key]['codMedic'] = $value['codMedic'];
                    $json[$key]['desc']     = $value['desc'];
                    $json[$key]['apMedic']  = $value['apMedic'];
                    $json[$key]['priAtivo'] = $value['priAtivo'];
                    $json[$key]['emp']      = $value['emp'];
                    $json[$key]['dadosAlt'] = $value['codMedic'].'||'.$value['desc'].'||'.$value['apMedic'].'||'.$value['priAtivo'].'||'.$value['emp'];
                }
            }else {
                //Busca o medicamentos conforme o código informado na busca.
                foreach ($dados as $key => $value) {
                    if($value['codMedic'] == $codigo):
                        foreach ($empresa as $keyEmp => $valueEmp) {
                            if($valueEmp['cod'] == $value['emp']){
                                $json[0]['empNome'] = $valueEmp['nome'];
                            }
                        }
                        $json[0]['codMedic'] = $value['codMedic'];
                        $json[0]['desc']     = $value['desc'];
                        $json[0]['apMedic']  = $value['apMedic'];
                        $json[0]['priAtivo'] = $value['priAtivo'];
                        $json[0]['emp']      = $value['emp'];
                        $json[0]['dadosAlt'] = $value['codMedic'].'|'.$value['desc'].'|'.$value['apMedic'].'|'.$value['priAtivo'].'|'.$value['emp'];
                        $encontrou ++;
                    endif;
                }
                if($encontrou == 0):
                    $json = array();
                    $json['alerta'] = utf8_encode('Medicamento não localizado. Favor verificar o código digitado.');
                endif;
            }
        endif;
    }
    echo json_encode($json);

<?php
    require_once('./movieDB.php');
    $db = new DataBase();
    /* Receive the RAW post data. */
    $content = trim(file_get_contents("php://input"));
    /* $decoded can be used the same as you would use $_POST in $.ajax */
    $decoded = json_decode($content, true);

    $user_logon = false;

    if(isset($_SESSION['user']))
        $user_logon = $_SESSION['user'];

    if(in_array('open',array_keys($decoded)))
        print_r(json_encode(['user' => $user_logon]));

    if(in_array('login',array_keys($decoded))){
        $stmt = "SELECT *
                 FROM user WHERE Email = '".$decoded['email']."' AND Password = '".$decoded['password']."' OR  Telephone = '".$decoded['email']."' AND Password = '".$decoded['password']."'";

        $profileRecord = $db->getData($stmt);
        $feedback = "Invalid user";
        $name = false;

        if($profileRecord){
            $name = $profileRecord[0]['Name'];
            $feedback = "Welcome ".$name;
            $_SESSION['user'] = $profileRecord[0]['Email'];
        }
        print_r(json_encode(['feedback' => $feedback, 'identity' => $name]));
    }

    if(in_array('lost',array_keys($decoded))){

        $stmt = "SELECT *
                 FROM lost";

        $lostRecord = $db->getData($stmt);
        $lostData = [];
        if($lostRecord){

            foreach($lostRecord as $lostItem){

                $stmt = "SELECT *
                         FROM user
                         WHERE Email = '".$lostItem['Email']."'";

                $userRecord = $db->getData($stmt);

                if($lostItem['Status'] == 0){ // Items not found

                   $lostData[] = array(
                        "name" => $userRecord[0]['Name'],
                        "telephone" => $userRecord[0]['Telephone'],
                        "item" => strtolower(trim($lostItem['Item'])),
                        "image" => $lostItem['Image'],
                        "area" => $lostItem['Area'],
                        "description" => $lostItem['Description'],
                        "index" => $lostItem['lostId']
                   );
                }

            }
        }
        print_r(json_encode([ "data" => $lostData, "user" => $user_logon]));
    }
    if(in_array('graph',array_keys($decoded))){
        $stmt = "SELECT *
                 FROM found";

        $foundRecord = $db->getData($stmt);
        $graphData = [];
        if($foundRecord){
            foreach($foundRecord as $foundItem){

                if($foundItem['Status'] == 1){ // Items found
                    if(in_array($foundItem['Date'],array_column($graphData,"date"))){
                        $work_key = array_keys(array_column($graphData,"date"),$foundItem['Date'])[0];
                       $graphData[$work_key]["count"] = (int)$graphData[array_keys(array_column($graphData,"date"),$foundItem['Date'])[0]]["count"] + 1;
                       $graphData[$work_key]["item"][] = $foundItem['Item'];
                       $graphData[$work_key]["img"][] = $foundItem['img'];
                       $graphData[$work_key]["description"][] = $foundItem['Description'];
                    }else{
                        $graphData[] = array(
                            "date" => $foundItem['Date'],
                            "count" => 1,
                            "description" => [$foundItem['Description']],
                            "img" => [strtolower(trim($foundItem['Image']))],
                            "item" => [strtolower(trim($foundItem['Item']))]
                        );
                    }
                }
            }
        }
        $stmt = "SELECT *
         FROM lost";

        $lostRecord = $db->getData($stmt);
        if($lostRecord){
            foreach($lostRecord as $lostItem){

                if($lostItem['Status'] == 1){ // Items found
                    if(in_array($lostItem['Date'],array_column($graphData,"date"))){
                        $work_key = array_keys(array_column($graphData,"date"),$lostItem['Date'])[0];
                       $graphData[$work_key]["count"] = (int)$graphData[$work_key]["count"] + 1;
                       $graphData[$work_key]["item"][] = $lostItem['Item'];
                       $graphData[$work_key]["img"][] = $lostItem['Image'];
                       $graphData[$work_key]["description"][] = $lostItem['Description'];
                    }else{
                        $graphData[] = array(
                            "date" => $lostItem['Date'],
                            "count" => 1,
                            "description" => [$lostItem['Description']],
                            "img" => [strtolower(trim($lostItem['Image']))],
                            "item" => [strtolower(trim($lostItem['Item']))]
                        );
                    }
                }
            }
        }
        $keys = array_column($graphData, 'date');
        array_multisort($keys, SORT_ASC, $graphData);
        print_r(json_encode($graphData));
    }
    if(in_array('update_found',array_keys($decoded))){
        $stmt = "UPDATE ".$decoded['table']."
                 SET Owner = '".$user_logon."', Status = '1'
                 WHERE  ".$decoded['id']." = ".$decoded['index'];

        $updateRecord = $db->updateData($stmt);
        return $updateRecord;
    }
    if(in_array('found',array_keys($decoded))){

        $stmt = "SELECT *
                 FROM found";

        $foundRecord = $db->getData($stmt);
        $foundData = [];
        if($foundRecord){

            foreach($foundRecord as $foundItem){

                $stmt = "SELECT *
                         FROM user
                         WHERE Email = '".$foundItem['Email']."'";

                $userRecord = $db->getData($stmt);

                if($foundItem['Status'] == 0){ // Items not found

                   $foundData[] = array(
                        "name" => $userRecord[0]['Name'],
                        "telephone" => $userRecord[0]['Telephone'],
                        "item" => strtolower(trim($foundItem['Item'])),
                        "image" => $foundItem['Image'],
                        "date" => $foundItem['Date'],
                        "description" => $foundItem['Description'],
                        "index" => $foundItem['foundId']
                   );
                }

            }
        }
        print_r(json_encode($foundData));
    }


?>
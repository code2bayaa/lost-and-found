<?php
    require_once('./movieDB.php');
    $db = new DataBase();
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
                    }else{
                        $graphData[] = array(
                            "date" => $foundItem['Date'],
                            "count" => 1,
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
                    }else{
                        $graphData[] = array(
                            "date" => $lostItem['Date'],
                            "count" => 1,
                            "img" => [strtolower(trim($lostItem['Image']))],
                            "item" => [strtolower(trim($lostItem['Item']))]
                        );
                    }
                }
            }
        }
        print_r(json_encode($graphData));
?>
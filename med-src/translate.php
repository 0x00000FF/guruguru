<?

/*
 * Guruguru LiveChat Translator
 * Translation API Mediator
 * 
 * Copyright (c) 2020 P.Knowledge (0x00000FF) and contributors
 * Licensed under MIT License.
 * 
 * This PHP file mediates API request/response between
 * guruguru extension and Naver Papago API.
 * 
 */

 $request = file_get_contents("php://input");
 $request_obj = json_decode($request);

 if ($request_obj == NULL) {
    http_response_code(400); 
    exit;
 }

 header("content-type: application/json");

 function request_curl($endpoint, $data) {
     global $request_obj;

     $curl = curl_init();

     $api_id = $request_obj->api_id;
     $api_key = $request_obj->api_key;

     curl_setopt($curl, CURLOPT_URL, "https://openapi.naver.com/v1/papago/$endpoint");
     curl_setopt($curl, CURLOPT_POST, TRUE);
     curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
     curl_setopt($curl, CURLOPT_HTTPHEADER, 
        array(
            "Content-Type: application/x-www-form-urlencoded",
            "X-Naver-Client-Id: $api_id",
            "X-Naver-Client-Secret: $api_key",
        ));
     curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    
     $content = curl_exec($curl);
     curl_close($curl);

     return $content;
 }

 $detectlang_data = "query=" . $request_obj->text;
 $response = json_decode( request_curl("detectLangs", $detectlang_data) );

 $src = $response->langCode;
 $dst = $request_obj->dest_lang;

 $translate_data = "source=$src&target=$dst&text=" . $request_obj->text;
 
 echo request_curl("n2mt", $translate_data);

<?php
    abstract class API
    {
        /**
         * Property: method
         * The HTTP method this request was made in, either GET, POST, PUT or DELETE
         */
        protected $method = '';
        /**
         * Property: endpoint
         * The Model requested in the URI. eg: /files
         */
        protected $endpoint = '';
        /**
         * Property: verb
         * An optional additional descriptor about the endpoint, used for things that can
         * not be handled by the basic methods. eg: /files/process
         */
        protected $verb = '';
        protected $request;
        protected $isAngular;
        protected $origin;
        /**
         * Property: args
         * Any additional URI components after the endpoint and verb have been removed, in our
         * case, an integer ID for the resource. eg: /<endpoint>/<verb>/<arg0>/<arg1>
         * or /<endpoint>/<arg0>
         */
        protected $args = Array();
        /**
         * Property: file
         * Stores the input of the PUT request
         */
         protected $file = Null;

        /**
         * Constructor: __construct
         * Allow for CORS, assemble and pre-process the data
         */
        public function __construct($request,$isAngular) {
            $this->request=$request;
            $this->isAngular=$isAngular;
            $this->origin=$_SERVER['REQUEST_URI'];
            
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: *");
            header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
            header("Content-Type: application/json");

            $this->args = explode('/', rtrim($_SERVER['REQUEST_URI'], '/'));
            $URI=explode('/',$_SERVER['REQUEST_URI']);
            $this->endpoint = $URI[2];

            if (array_key_exists(0, $this->args) && !is_numeric($this->args[0])) {
                $this->verb = array_shift($this->args);
            }

            $this->method = $_SERVER['REQUEST_METHOD'];
            if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
                if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
                    $this->method = 'DELETE';
                } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
                    $this->method = 'PUT';
                } else {
                    throw new Exception("Unexpected Header");
                }
            }
            if($isAngular=='Y'){
                $this->request=$request;
            }else{
                switch($this->method) {
                    case 'POST':
                        $this->request = $this->_cleanInputs($_POST);
                        break;
                    case 'GET':
                        $this->request = $this->_cleanInputs($_GET);
                        break;
                    case 'PUT':
                        $this->request = $this->_cleanInputs($_GET);
                        $this->file = file_get_contents("php://input");
                        break;
                    default:
                        throw new Exception('Invalid Method');
                    break;
                }
            }
        }

        public function coinbaseAPI($tokens,$endpoint,$data){
                            
            $ch = curl_init();
            $headers = [
                'Content-Type: application/json',
                'Authorization: Bearer '.$tokens['access_token']
            ];
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($ch, CURLOPT_URL, $endpoint);
            if(isset($data) && $data!=''){                                                                   
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST"); 
                curl_setopt($ch,CURLOPT_POSTFIELDS, json_encode($data));
            }
            $result = json_decode(curl_exec($ch),1);

            curl_close($ch);
            
            return $result;

        }  

        public function processAPI() {
            if (!array_key_exists('apiKey', $this->request)) {
                throw new Exception('No API Key provided');
            } else if ($this->request['apiKey']!='00xzcvY59zL2MvZ4NnZzd3cl5SaqQ') {
                throw new Exception('Invalid API Key');
            } 
            
            if (method_exists($this, $this->endpoint)) {
                return $this->_response($this->{$this->endpoint}($this->args));
            }
            return $this->_response("No Endpoint: $this->endpoint", 404);
        }

        private function _response($data, $status = 200) {
            header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
            return json_encode($data);
        }

        private function _cleanInputs($data) {
            $clean_input = Array();
            if (is_array($data)) {
                foreach ($data as $k => $v) {
                    $clean_input[$k] = $this->_cleanInputs($v);
                }
            } else {
                $clean_input = trim(strip_tags($data));
            }
            return $clean_input;
        }

        private function _requestStatus($code) {
            $status = array(  
                200 => 'OK',
                404 => 'Not Found',   
                405 => 'Method Not Allowed',
                500 => 'Internal Server Error',
            ); 
            return ($status[$code])?$status[$code]:$status[500]; 
        }
    }

    class DefaultAPI extends API {
        //protected $User;

        public function __construct($request, $origin) {
            parent::__construct($request);
            
            if (!array_key_exists('apiKey', $this->request)) {
                throw new Exception('No API Key provided');
            } else if ($this->request['apiKey']!='00xzcvY59zL2MvZ4NnZzd3cl5SaqQ') {
                throw new Exception('Invalid API Key');
            } 
            
        }

        ///*https://api.nostradamusbot.com/?apiKey=00xzcvY59zL2MvZ4NnZzd3cl5SaqQ&request=check*/
        protected function check() {
            return $this->data=array('response'=>'API LOADED.','status'=>'200');
        }
                  
    }
 
?>
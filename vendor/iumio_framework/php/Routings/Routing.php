<?php


namespace iumioFramework\Masters;
use iumioFramework\Core\Base\Debug\Debug;
use iumioFramework\Core\Base\RtListener;
use iumioFramework\Core\Base\iumioEnvironment as Env;

/**
 * Class Routing
 * @package iumioFramework\Masters
 * @author RAFINA Dany <danyrafina@gmail.com>
 */

class Routing extends RtListener
{
    private $app;
    private $framework;
    private $isbase;

    /**
     * Register a router to iumioCore
     */

    /**
     * Routing constructor.
     * @param string $app App name
     * @param string $framework framework name
     * @param bool $isbase Check is a base app
     */
    public function __construct(string $app, string $framework, bool $isbase = false)
    {
        $this->app =  $app;
        $this->framework = $framework;
        $this->isbase = $isbase;
        parent::__construct($app);
    }

    /** Register a router
     * @return bool Is callable
     */
    public function routingRegister():bool
    {
        return ((parent::open($this->isbase) == 1)? true : false);
    }

    /** Get all route
     * @return array Route result
     */
    public function routes()
    {
        return ($this->router);
    }


    /** Get similarity routes
     * @param $appRoute string the app route
     * @param $webRoute string The URI
     * @param $route array Params app name
     * @return array Similarity and match
     */
    static public function matches(string $appRoute, string $webRoute, array $route):array
    {
        $paramValues = array();
        $aRE = explode('/', $appRoute);
        $wRE = explode('/', $webRoute);

        $script = "";
        if (strpos($webRoute, Env::getFileEnv(ENVIRONMENT)) !== false)
            $script = "/".Env::getFileEnv(ENVIRONMENT);

        if ($script.$appRoute == $webRoute)
            return (array("is" => "same", "similar" => 100));

        if ((count($aRE) == count($wRE)) && count($aRE) > 0)
        {
            for($i = 0; $i < count($aRE); $i++) {
                if ($aRE[$i] != $wRE[$i]) array_push($paramValues, $wRE[$i]);
            }
        }

        if (isset($route['params']))
        {
            if (count($paramValues) == count($route['params'])) {
                similar_text($script.$appRoute, $webRoute, $pe);
                return (array("is" => "partial", "result" => $paramValues, "similar" => $pe));
            }
        }
        return (array("is" => "nomatch", "similar" => 0));
    }

}


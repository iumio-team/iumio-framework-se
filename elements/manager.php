<?php

namespace iumioFramework\Core\Additionnal\Console\Manager;

try
{
    $loader = require_once __DIR__.'/../vendor/iumio_framework/php/Core/Requirement/iumoEngineAutoloader.php';
}
catch (\Exception $e)
{
    throw new \Exception("iumio Manager error : cannot get autoloader => ".$e->getMessage());
}

use iumioFramework\Core\Base\Debug\Debug;
use iumioFramework\Core\Additionnal\Console\Manager\iumioManager as CoreManager;
error_reporting(E_ALL);

/**
 * Class manager
 * @package iumioFramework\Core\Additionnal\Console\Manager
 * @author RAFINA Dany <danyrafina@gmail.com>
 */

class manager
{
    /** Manager main function
     * @param int $argc
     * @param array $argv
     */
    public function main(int $argc, array $argv)
    {
        Debug::enabled();
        $man = new CoreManager();
        $this->define();
        $man->run($argc, $argv);

    }

    /**
     * Define environment variable for all iumio manager components
     */
    final private function define()
    {
        \define('ROOT', __DIR__, true);
        \define('ROOT_PROJECT', __DIR__.'/..', true);
        \define('ROOT_CACHE', __DIR__.'/cache', true);
        \define('ROOT_APPS', __DIR__.'/..'."/apps/", true);
        \define('ELEMS', __DIR__ . '/..', true);
        \define('ROOT_VENDOR_LIBS',  __DIR__.'/..'."/vendor/libs/", true);
        \define('ROOT_VENDOR_CLI_MODULES',  __DIR__.'/..'."/vendor/iumio_framework/php/Core/Additional/Manager/Module/", true);

    }
}

(new manager())->main($argc, $argv);
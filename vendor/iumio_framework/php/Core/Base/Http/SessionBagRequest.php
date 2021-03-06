<?php

namespace iumioFramework\Core\Base\Http;

/**
 * Session Bag store.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Dany Rafina <danyrafina@gmail.com>
 * @category Framework
 * @licence  MIT License
 * @link https://framework.iumio.com
 * @author   RAFINA Dany <danyrafina@gmail.com>
 */

interface SessionBagRequest
{
    /**
     * Gets this bag's name.
     *
     * @return string
     */
    public function getName();

    /**
     * Initializes the Bag.
     *
     * @param array $array
     */
    public function initialize(array &$array);

    /**
     * Gets the storage key for this bag.
     *
     * @return string
     */
    public function getStorageKey();

    /**
     * Clears out data from bag.
     *
     * @return mixed Whatever data was contained
     */
    public function clear();
}

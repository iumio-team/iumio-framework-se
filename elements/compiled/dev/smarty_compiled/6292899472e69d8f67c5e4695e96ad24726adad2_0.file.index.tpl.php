<?php
/* Smarty version 3.1.32-dev-1, created on 2017-05-18 22:24:15
  from "/Applications/MAMP/htdocs/iumio-framework/apps/TestApp/Front/views/index.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32-dev-1',
  'unifunc' => 'content_591e02ef753749_29769910',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '6292899472e69d8f67c5e4695e96ad24726adad2' => 
    array (
      0 => '/Applications/MAMP/htdocs/iumio-framework/apps/TestApp/Front/views/index.tpl',
      1 => 1495139054,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_591e02ef753749_29769910 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_loadInheritance();
$_smarty_tpl->inheritance->init($_smarty_tpl, true);
?>


<?php 
$_smarty_tpl->inheritance->instanceBlock($_smarty_tpl, 'Block_1458382024591e02ef751554_38169947', "parameters");
$_smarty_tpl->inheritance->endChild($_smarty_tpl, 'template.tpl');
}
/* {block "parameters"} */
class Block_1458382024591e02ef751554_38169947 extends Smarty_Internal_Block
{
public $subBlocks = array (
  'parameters' => 
  array (
    0 => 'Block_1458382024591e02ef751554_38169947',
  ),
);
public function callBlock(Smarty_Internal_Template $_smarty_tpl) {
?>

<p>This is your app </p>
<?php
}
}
/* {/block "parameters"} */
}
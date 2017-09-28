<?php
/* Smarty version 3.1.31, created on 2017-09-24 20:44:32
  from "/Applications/MAMP/htdocs/iumio-framework/vendor/iumio_framework/php/BaseApps/ManagerApp/Front/views/template.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.31',
  'unifunc' => 'content_59c7fd10bcd882_40942379',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '9636b9e2ab66ecd95945621d4c4590b795da12c8' => 
    array (
      0 => '/Applications/MAMP/htdocs/iumio-framework/vendor/iumio_framework/php/BaseApps/ManagerApp/Front/views/template.tpl',
      1 => 1503082322,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:partials/modal.tpl' => 1,
  ),
),false)) {
function content_59c7fd10bcd882_40942379 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_loadInheritance();
$_smarty_tpl->inheritance->init($_smarty_tpl, false);
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::img_manager(array('name'=>'favicon/apple-touch-icon.png'),$_smarty_tpl);?>
">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::img_manager(array('name'=>'favicon/favicon-32x32.png'),$_smarty_tpl);?>
">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::img_manager(array('name'=>'favicon/favicon-16x16.png'),$_smarty_tpl);?>
">
    <link rel="manifest" href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::img_manager(array('name'=>'favicon/manifest.json'),$_smarty_tpl);?>
">
    <link rel="mask-icon" href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::img_manager(array('name'=>'favicon/safari-pinned-tab.svg'),$_smarty_tpl);?>
" color="#5bbad5">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

    <title>iumio Manager</title>

    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
    <meta name="viewport" content="width=device-width" />

    <?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::btsp_css(array('min'=>'yes'),$_smarty_tpl);?>

    <?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::animate_css(array('min'=>'yes'),$_smarty_tpl);?>

    <?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::css_manager(array('name'=>'light-bootstrap-dashboard'),$_smarty_tpl);?>

    <?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::css_manager(array('name'=>'demo'),$_smarty_tpl);?>

    <?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::css_manager(array('name'=>'index'),$_smarty_tpl);?>


    <!--     Fonts and icons     -->
    <?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::font_awesome_css(array('min'=>'yes'),$_smarty_tpl);?>

    <?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::css_manager(array('name'=>'light-bootstrap-dashboard'),$_smarty_tpl);?>

    <link href='http://fonts.googleapis.com/css?family=Roboto:400,700,300' rel='stylesheet' type='text/css'>
    <?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::css_manager(array('name'=>'pe-icon-7-stroke'),$_smarty_tpl);?>


</head>

<body>

<?php 
$_smarty_tpl->inheritance->instanceBlock($_smarty_tpl, 'Block_104176718559c7fd0f4b0861_31856597', "principal");
?>


<?php $_smarty_tpl->_subTemplateRender('file:partials/modal.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

</div>
</div>

<!--   Core JS Files   -->
<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::jquery(array(),$_smarty_tpl);?>

<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::btsp_js(array('min'=>'yes'),$_smarty_tpl);?>

<!--  Checkbox, Radio & Switch Plugins -->
<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::js_manager(array('name'=>'bootstrap-checkbox-radio-switch'),$_smarty_tpl);?>

<!--  Notifications Plugin    -->
<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::js_manager(array('name'=>'bootstrap-notify'),$_smarty_tpl);?>

<!-- Light Bootstrap Table Core javascript and methods for Demo purpose -->
<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::js_manager(array('name'=>'light-bootstrap-dashboard'),$_smarty_tpl);?>


<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::js_manager(array('name'=>'demo'),$_smarty_tpl);?>


<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::js_manager(array('name'=>'main'),$_smarty_tpl);?>


</body>
</html><?php }
/* {block "principal"} */
class Block_104176718559c7fd0f4b0861_31856597 extends Smarty_Internal_Block
{
public $subBlocks = array (
  'principal' => 
  array (
    0 => 'Block_104176718559c7fd0f4b0861_31856597',
  ),
);
public function callBlock(Smarty_Internal_Template $_smarty_tpl) {
?>

<?php
}
}
/* {/block "principal"} */
}

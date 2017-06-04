<?php
/* Smarty version 3.1.32-dev-1, created on 2017-06-04 02:02:33
  from "/Applications/MAMP/htdocs/iumio-framework/vendor/iumio_framework/php/BaseApps/ManagerApp/Front/views/assetsmanager.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32-dev-1',
  'unifunc' => 'content_59334e19570e38_67405016',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '7fe7e7930e1626181c81f8d3d0d3091f25092d65' => 
    array (
      0 => '/Applications/MAMP/htdocs/iumio-framework/vendor/iumio_framework/php/BaseApps/ManagerApp/Front/views/assetsmanager.tpl',
      1 => 1496534391,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:partials/sidebar.tpl' => 1,
    'file:partials/footer.tpl' => 1,
  ),
),false)) {
function content_59334e19570e38_67405016 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_loadInheritance();
$_smarty_tpl->inheritance->init($_smarty_tpl, true);
?>

<?php 
$_smarty_tpl->inheritance->instanceBlock($_smarty_tpl, 'Block_28818757959334e18ec6915_63717726', "principal");
?>


<?php $_smarty_tpl->inheritance->endChild($_smarty_tpl, 'template.tpl');
}
/* {block "principal"} */
class Block_28818757959334e18ec6915_63717726 extends Smarty_Internal_Block
{
public $subBlocks = array (
  'principal' => 
  array (
    0 => 'Block_28818757959334e18ec6915_63717726',
  ),
);
public function callBlock(Smarty_Internal_Template $_smarty_tpl) {
?>

<div class="wrapper">
    <?php $_smarty_tpl->_subTemplateRender('file:partials/sidebar.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

    <div class="main-panel">
        <nav class="navbar navbar-default navbar-fixed">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">Assets Manager</a>
                    <a class="btn-default btn publishallassets"  attr-href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::route(array('name'=>'iumio_manager_compile_manager_remove_all'),$_smarty_tpl);?>
">Publish all</a>
                    <a class="btn-default btn publishalldevassets"  attr-href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::route(array('name'=>'iumio_manager_compile_manager_remove_all'),$_smarty_tpl);?>
">Publish all dev</a>
                    <a class="btn-default btn publishallprodassets"  attr-href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::route(array('name'=>'iumio_manager_compile_manager_remove_all'),$_smarty_tpl);?>
">Publish all prod</a>
                    <a class="btn-default btn clearallassets"  attr-href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::route(array('name'=>'iumio_manager_compile_manager_remove_all'),$_smarty_tpl);?>
">Clear all</a>
                    <a class="btn-default btn clearalldevassets"  attr-href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::route(array('name'=>'iumio_manager_compile_manager_remove_all'),$_smarty_tpl);?>
">Clear all dev</a>
                    <a class="btn-default btn clearallprodassets"  attr-href="<?php echo iumioFramework\Core\Additionnal\Template\iumioViewBasePlugin::route(array('name'=>'iumio_manager_compile_manager_remove_all'),$_smarty_tpl);?>
">Clear all prod</a>

                </div>

            </div>
        </nav>
        <div class="content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="header">
                                <h4 class="title">List of your app</h4>
                                <p class="category">Referer to apps.json</p>
                            </div>
                            <div class="content table-responsive table-full-width">
                                <table class="table table-hover table-striped">
                                    <thead>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Is default</th>
                                    <th>Namespace</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>0</td>
                                        <td>DakotaRice</td>
                                        <td>Yes</td>
                                        <td>A/A</td>
                                        <td><button>E</button></td>
                                        <td><button>D</button></td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>MinervaHooper</td>
                                        <td>No</td>
                                        <td>B/B</td>
                                        <td><button>E</button></td>
                                        <td><button>D</button></td>
                                    </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php $_smarty_tpl->_subTemplateRender('file:partials/footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>


    </div>
</div>
<?php
}
}
/* {/block "principal"} */
}

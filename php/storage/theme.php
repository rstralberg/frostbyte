<?php

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/themeblock.php";

class Theme
{
	public const TABLENAME = 'theme';
	public $id;
	public $name;
	public $app;
	public $top;
	public $nav;
	public $page;
	public $footer;
	public $buttons;
	public $links;
	public $headers;
	public $input;
	public $blocks;
	public $quote;
	public $code;
	


	public function __construct($db)
	{
		$this->id = 0;
		$create = !$db->tableExist(Theme::TABLENAME);
		if ($create) {

			$db->query("CREATE TABLE " . Theme::TABLENAME . " (
				`id` INT(11) NOT NULL AUTO_INCREMENT,
				`name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_swedish_ci',
				`app` VARCHAR(512) NOT NULL,
				`top` VARCHAR(512) NOT NULL,
				`nav` VARCHAR(512) NOT NULL,
				`page` VARCHAR(512) NOT NULL,
				`footer` VARCHAR(512) NOT NULL,
				`buttons` VARCHAR(512) NOT NULL,
				`links` VARCHAR(255) NOT NULL,
				`headers` VARCHAR(2048) NOT NULL,
				`input` VARCHAR(512) NOT NULL,
				`blocks` VARCHAR(512) NOT NULL,
				`quote` VARCHAR(512) NOT NULL,
				`code` VARCHAR(512) NOT NULL,
				PRIMARY KEY (`id`) USING BTREE
			)
			COLLATE='utf8mb4_general_ci'
			ENGINE=InnoDB");
		}
	}


	public static function read($db, $where = null, $order = null)
	{
		$themes = array();
		$sql = 'SELECT * FROM ' . Theme::TABLENAME;
		if ($where) {
			$sql .= ' WHERE ' . $where;
		}
		if ($order) {
			$sql .= ' ORDER BY ' . $order;
		}
		$result = $db->query($sql);
		if (DB::hasRows($result)) {
			while ($row = DB::next($result)) {
				$theme =  new Theme($db);
				$theme->id =  $row['id'];
				$theme->name =  $row['name'];
				$theme->app = $row['app'];
				$theme->top = $row['top'];
				$theme->nav = $row['nav'];
				$theme->page = $row['page'];
				$theme->footer = $row['footer'];
				$theme->buttons = $row['buttons'];
				$theme->links = $row['links'];
				$theme->headers = $row['headers'];
				$theme->input = $row['input'];
				$theme->blocks = $row['blocks'];
				$theme->quote = $row['quote'];
				$theme->code = $row['code'];
				array_push($themes, $theme);
			}
		}
		return $themes;
	}

	public static function write($db, $theme)
	{
		if ($db->rowExist(Theme::TABLENAME, $theme->id)) {
			$db->query(
				'UPDATE ' . Theme::TABLENAME . ' SET ' .
					'`name`=' . DB::string($theme->name) . ',' .
					'`app`=' . DB::string($theme->app) . ',' .
					'`top`=' . DB::string($theme->top) . ',' .
					'`nav`=' . DB::string($theme->nav) . ',' .
					'`page`=' . DB::string($theme->page) . ',' .
					'`footer`=' . DB::string($theme->footer) . ',' .
					'`buttons`=' . DB::string($theme->buttons) . ',' .
					'`links`=' . DB::string($theme->links) . ',' .
					'`headers`=' . DB::string($theme->headers) . ',' .
					'`input`=' . DB::string($theme->input) . ',' .
					'`blocks`=' . DB::string($theme->blocks) . ',' .
					'`quote`=' . DB::string($theme->quote) . ',' .
					'`code`=' . DB::string($theme->code) . ' ' .
					'WHERE `id`=' . $theme->id
			);
		} else {
			$db->query('INSERT INTO ' . Theme::TABLENAME . ' (
				`name`,
				`app`,
				`top`,
				`nav`,
				`page`,
				`footer`,
				`buttons`,
				`links`,
				`headers`,
				`input`,
				`blocks`,
				`quote`,
				`code`)
				VALUES (' .
				DB::string($theme->name) . ',' .
				DB::string($theme->app) . ',' .
				DB::string($theme->top) . ',' .
				DB::string($theme->nav) . ',' .
				DB::string($theme->page) . ',' .
				DB::string($theme->footer) . ',' .
				DB::string($theme->buttons) . ',' .
				DB::string($theme->links) . ',' .
				DB::string($theme->headers) . ',' .
				DB::string($theme->input) . ',' .
				DB::string($theme->blocks) . ',' .
				DB::string($theme->quote) . ',' .
				DB::string($theme->code) . ')');
			$theme->id = $db->get_last_id();
		}
	}

	public static function delete($db, $where)
	{
		$db->query(
			'DELETE FROM ' . Theme::TABLENAME . ' WHERE ' . $where
		);
	}
}


function create_theme($db, $name)
{
	$theme = new Theme($db);
	$theme->name = $name;

	$app = new ThemeApp();
	$app->font_app = 'Arial';
	$app->fsize_app = '1.0em';
	$app->width_app = '80vw';
	$app->bg_app = 'rgb(32,32,32)';
	$app->fg_app = 'rgb(255,255,255)';
	$theme->app = ThemeApp::stringify($app);

	$top = new ThemeTop();
	$top->bg_top = 'rgb(0,0,0)';
	$top->border_top = '0px solid rgb(200,200,200)';
	$top->radius_top = '0px';
	$top->shadow_top = 'false';
	$top->height_top = '8vh';
	$theme->top = ThemeTop::stringify($top);

	$nav = new ThemeNav();
	$nav->bg_nav = 'rgb(0,0,0)';
	$nav->fg_nav = 'rgb(255,255,255)';
	$nav->border_nav = '0px solid rgb(200,200,200)';
	$nav->hi_bg_nav = 'rgb(255,70,0)';
	$nav->hi_fg_nav = 'rgb(0,0,0)';
	$nav->hi_border_nav = '2px solid rgb(255,255,255)';
	$nav->bold_nav = 'bold';
	$nav->fsize_nav = '1.2em';
	$nav->shadow_nav = 'false';
	$nav->radius_nav = '4px';
	$theme->nav = ThemeNav::stringify($nav);

	$page = new ThemeMain();
	$page->bg_page = 'rgb(32,32,32)';
	$page->fg_page = 'rgb(255,255,255)';
	$page->border_page = '0px solid rgb(200,200,200)';
	$page->radius_page = '0px';
	$page->shadow_page = 'false';
	$theme->page = ThemeMain::stringify($page);

	$footer = new ThemeFooter();
	$footer->bg_footer = 'rgb(0,0,0)';
	$footer->fg_footer = 'rgb(255,255,255)';
	$footer->border_footer = '0px solid rgb(200,200,200)';
	$footer->radius_footer = '0px';
	$footer->bold_footer = 'normal';
	$footer->fsize_footer = '1.0em';
	$footer->align_footer = 'center';
	$footer->shadow_footer = 'false';
	$footer->height_footer = '2vh';
	$theme->footer = ThemeFooter::stringify($footer);

	$buttons = new ThemeButtons();
	$buttons->bg_btn = 'rgb(0,0,0)';
	$buttons->fg_btn = 'rgb(255,255,255)';
	$buttons->border_btn = '2px solid rgb(255,255,255)';
	$buttons->hi_bg_btn = 'rgb(255,70,0)';
	$buttons->hi_fg_btn = 'rgb(0,0,0)';
	$buttons->hi_border_btn = '2px solid rbg(0,255,255)';
	$buttons->fsize_btn = '1.1em';
	$buttons->bold_btn = 'bold';
	$buttons->shadow_btn = 'false';
	$buttons->radius_btn = '4px';
	$theme->buttons = ThemeButtons::stringify($buttons);

	$links = new ThemeLinks();
	$links->fg_link = 'rgb(0,255,255)';
	$links->hi_fg_link = 'rgb(255,255,255)';
	$links->bold_link = 'bold';
	$theme->links = ThemeLinks::stringify($links);

	$headers = new ThemeHeaders();
	$headers->fg_title = 'rgb(255,70,0)';
	$headers->fsize_title = '1.8em';
	$headers->bold_title = 'bold';
	$headers->align_title = 'left';
	$headers->fg_h = 'rgb(255,70,0)';
	$headers->bold_h = 'bold';
	$headers->align_h = 'left';
	$headers->fsize_h1 = '1.6em';
	$headers->fsize_h2 = '1.4em';
	$headers->fsize_h3 = '1.2em';
	
	$theme->headers = ThemeHeaders::stringify($headers);

	$input = new ThemeInput();
	$input->bg_inp = 'rgb(200,200,200)';
	$input->fg_inp = 'rgb(64,64,64)';
	$input->hi_bg_inp = 'rgb(255,255,255)';
	$input->hi_fg_inp = 'rgb(0,0,0)';
	$input->border_inp = '2px solid rgb(0,0,0)';
	$input->radius_inp = '4px';
	$input->shadow_inp = 'false';
	$input->fsize_inp = '1.0em';
	$theme->input = ThemeInput::stringify($input);

	$blocks = new ThemeSections();
	$blocks->bg_block = 'rgb(32,32,32)';
	$blocks->fg_block = 'rgb(255,255,255)';
	$blocks->border_block = '0px solid rgb(200,200,200)';
	$blocks->radius_block = '0px';
	$blocks->shadow_block = 'false';
	$blocks->fsize_block = '1.0em';
	$theme->blocks = ThemeSections::stringify($blocks);

	$quote = new ThemeQuote();
	$quote->bg_quote = 'rgb(32,32,64)';
	$quote->fg_quote = 'rgb(200,200,255)';
	$quote->fstyle_quote = 'italic';
	$theme->quote = ThemeQuote::stringify($quote);

	$code	= new ThemeCode();
	$code->bg_code = 'rgb(0,32,0)';
	$code->fg_code = 'rgb(255,127,0)';
	$code->font_code = 'Courier New, Courier, monospace';
	$code->fstyle_code = 'normal';
	$theme->code = ThemeCode::stringify($code);

	Theme::write($db, $theme);
}

function generate_style($db, $name)
{

	$style = ':root {';

	$themes = Theme::read($db, '`name`=' . DB::string($name));
	if (count($themes) === 0) {
		die('Unable to load theme ' . $name);
	}
	$theme = $themes[0];

	$style .= '--theme_id:' . $theme->id . ';';
	$style .= '--theme_name:' . DB::string($theme->name) . ';';

	$style .= ThemeApp::style(ThemeApp::parse($theme->app));

	$style .= ThemeTop::style(ThemeTop::parse($theme->top));
	$style .= ThemeNav::style(ThemeNav::parse($theme->nav));
	$style .= ThemeMain::style(ThemeMain::parse($theme->page));
	$style .= ThemeFooter::style(ThemeFooter::parse($theme->footer));
	$style .= ThemeButtons::style(ThemeButtons::parse($theme->buttons));
	$style .= ThemeLinks::style(ThemeLinks::parse($theme->links));
	$style .= ThemeHeaders::style(ThemeHeaders::parse($theme->headers));
	$style .= ThemeInput::style(ThemeInput::parse($theme->input));
	$style .= ThemeSections::style(ThemeSections::parse($theme->blocks));
	$style .= ThemeQuote::style(ThemeQuote::parse($theme->quote));
	$style .= ThemeCode::style(ThemeCode::parse($theme->code));

	$style .= '}';
	return $style;
}

function generate_css($db, $name)
{

	$themes = Theme::read($db, '`name`=' . DB::string($name));
	if (count($themes) === 0) {
		die('Unable to load theme ' . $name);
	}
	$theme = $themes[0];

	$css = '';
	$css .= ThemeApp::css(ThemeApp::parse($theme->app)) . PHP_EOL;
	$css .= ThemeTop::css(ThemeTop::parse($theme->top)) . PHP_EOL;
	$css .= ThemeNav::css(ThemeNav::parse($theme->nav)) . PHP_EOL;
	$css .= ThemeMain::css(ThemeMain::parse($theme->page)) . PHP_EOL;
	$css .= ThemeFooter::css(ThemeFooter::parse($theme->footer)) . PHP_EOL;
	$css .= ThemeButtons::css(ThemeButtons::parse($theme->buttons)) . PHP_EOL;
	$css .= ThemeLinks::css(ThemeLinks::parse($theme->links)) . PHP_EOL;
	$css .= ThemeHeaders::css(ThemeHeaders::parse($theme->headers)) . PHP_EOL;
	$css .= ThemeInput::css(ThemeInput::parse($theme->input)) . PHP_EOL;
	$css .= ThemeSections::css(ThemeSections::parse($theme->blocks)) . PHP_EOL;
	$css .= ThemeQuote::css(ThemeQuote::parse($theme->quote)) . PHP_EOL;
	$css .= ThemeCode::css(ThemeCode::parse($theme->code)) . PHP_EOL;

	return $css;
}


class ThemeApp
{

	public $font_app;
	public $fsize_app;
	public $width_app;
	public $bg_app;
	public $fg_app;

	public static function stringify($tg)
	{
		return json_encode($tg);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tg)
	{
		return
			'--font-app:' . $tg->font_app . ';' .
			'--fsize-app:' . $tg->fsize_app . ';' .
			'--width-app:' . $tg->width_app . ';' .
			'--bg-app:' . $tg->bg_app . ';' .
			'--fg-app:' . $tg->fg_app . ';';
	}

	public static function css($obj)
	{
		return
			'html {
			font-family:var(--font-app);
			font-size:var(--fsize-app);
			width:var(--width-app);
			background:var(--bg-app);
			color:var(--fg-app);
		}';
	}
}

class ThemeTop
{
	public $bg_top;
	public $border_top;
	public $radius_top;
	public $shadow_top;
	public $height_top;

	public static function stringify($tt)
	{
		return json_encode($tt);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tt)
	{
		return
			'--bg-top:' . $tt->bg_top . ';' .
			'--border-top:' . $tt->border_top . ';' .
			'--radius-top:' . $tt->radius_top . ';' .
			'--shadow-top:' . $tt->shadow_top . ';' .
			'--height-top:' . $tt->height_top . ';';
	}

	public static function css($obj)
	{
		return
		'.topnav {
			overflow: hidden;
			background: var(--bg-top);
			border: var(--border-top);
			border-radius: var(--radius-top);
			height: var(--height-top);
			width: var(--width-app);
			margin-top:0 !important;
			margin-bottom: 32px !important;
			padding: 0 !important;
		}
		';
	}
}

class ThemeNav
{
	public $bg_nav;
	public $fg_nav;
	public $border_nav;
	public $hi_bg_nav;
	public $hi_fg_nav;
	public $hi_border_nav;
	public $bold_nav;
	public $fsize_nav;
	public $shadow_nav;
	public $radius_nav;

	public static function stringify($tn)
	{
		return json_encode($tn);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tn)
	{
		return
			'--bg-nav:' . $tn->bg_nav . ';' .
			'--fg-nav:' . $tn->fg_nav . ';' .
			'--border-nav:' . $tn->border_nav . ';' .
			'--hi-bg-nav:' . $tn->hi_bg_nav . ';' .
			'--hi-fg-nav:' . $tn->hi_fg_nav . ';' .
			'--hi-border-nav:' . $tn->hi_border_nav . ';' .
			'--bold-nav:' . $tn->bold_nav . ';' .
			'--fsize-nav:' . $tn->fsize_nav . ';' .
			'--shadow-nav:' . $tn->shadow_nav . ';' .
			'--radius-nav:' . $tn->radius_nav . ';';
	}

	public static function css($obj)
	{
		return
			'.nav {
			background:var(--bg-nav);
			color:var(--fg-nav);
			border:var(--border-nav);
			border-radius:var(--radius-nav);
			font-size:var(--fsize-nav);
			font-weight:var(--bold-nav);
		}'  .  PHP_EOL . 
		'.nav:hover {
			background:var(--hi-bg-nav);
			color:var(--hi-fg-nav);
			border:var(--hi-border-nav);
		}' .  PHP_EOL . 
		'.nav:active {
			background:var(--hi-bg-nav);
			color:var(--hi-fg-nav);
			border:var(--hi-border-nav);
		}
		';
	}
}

class ThemeMain
{
	public $bg_page;
	public $fg_page;
	public $border_page;
	public $radius_page;
	public $shadow_page;

	public static function stringify($tp)
	{
		return json_encode($tp);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tp)
	{
		return
			'--bg-page:' . $tp->bg_page . ';' .
			'--fg-page:' . $tp->fg_page . ';' .
			'--border-page:' . $tp->border_page . ';' .
			'--radius-page:' . $tp->radius_page . ';' .
			'--shadow-page:' . $tp->shadow_page . ';';
	}

	public static function css($obj)
	{
		return
			'main {
			background:var(--bg-page);
			color:var(--fg-page);
			border:var(--border-page);
			border-radius:var(--radius-page);
			width:var(--width-app);
		}
		';
	}
}

class ThemeFooter
{
	public $bg_footer;
	public $fg_footer;
	public $border_footer;
	public $radius_footer;
	public $bold_footer;
	public $fsize_footer;
	public $align_footer;
	public $shadow_footer;
	public $height_footer;

	public static function stringify($tf)
	{
		return json_encode($tf);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tf)
	{
		return
			'--bg-footer:' . $tf->bg_footer . ';' .
			'--fg-footer:' . $tf->fg_footer . ';' .
			'--border-footer:' . $tf->border_footer . ';' .
			'--radius-footer:' . $tf->radius_footer . ';' .
			'--bold-footer:' . $tf->bold_footer . ';' .
			'--fsize-footer:' . $tf->fsize_footer . ';' .
			'--align-footer:' . $tf->align_footer . ';' .
			'--shadow-footer:' . $tf->shadow_footer . ';' .
			'--height-footer:' . $tf->height_footer . ';';
	}

	public static function css($obj)
	{
		return
			'footer  {
			background:var(--bg-footer);
			color:var(--fg-footer);
			border:var(--border-footer);
			border-radius:var(--radius-footer);
			font-weight:var(--bold-footer);
			font-size:var(--fsize-footer);
			text-align:var(--align-footer);
			width:var(--width-app);
			position: fixed;
			bottom: 0;
			height:var(--height-footer);
			}
		';
	}
}

class ThemeButtons
{
	public $bg_btn;
	public $fg_btn;
	public $border_btn;
	public $hi_bg_btn;
	public $hi_fg_btn;
	public $hi_border_btn;
	public $fsize_btn;
	public $bold_btn;
	public $shadow_btn;
	public $radius_btn;

	public static function stringify($tb)
	{
		return json_encode($tb);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tb)
	{
		return
			'--bg-btn:' . $tb->bg_btn . ';' .
			'--fg-btn:' . $tb->fg_btn . ';' .
			'--border-btn:' . $tb->border_btn . ';' .
			'--hi-bg-btn:' . $tb->hi_bg_btn . ';' .
			'--hi-fg-btn:' . $tb->hi_fg_btn . ';' .
			'--hi-border-btn:' . $tb->hi_border_btn . ';' .
			'--fsize-btn:' . $tb->fsize_btn . ';' .
			'--bold-btn:' . $tb->bold_btn . ';' .
			'--shadow-btn:' . $tb->shadow_btn . ';' .
			'--radius-btn:' . $tb->radius_btn . ';';
	}

	public static function css($obj)
	{
		return
			'button  {
			background:var(--bg-btn);
			color:var(--fg-btn);
			border:var(--border-btn);
			border-radius:var(--radius-btn);
			font-weight:var(--bold-btm);
			font-size:var(--fsize-btn);
			margin: 6px;
			height: 36px;
		}' .  PHP_EOL . 
		'button:hover {
			background:var(--hi-bg-btn);
			color:var(--hi-fg-btn);
			border:var(--hi-border-btn);
		}' .  PHP_EOL . 
		'button:active {
			background:var(--hi-bg-btn);
			color:var(--hi-fg-btn);
			border:var(--hi-border-btn);
		}	
		';
	}
}

class ThemeLinks
{
	public $fg_link;
	public $hi_fg_link;
	public $bold_link;

	public static function stringify($tl)
	{
		return json_encode($tl);
	}
	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tl)
	{
		return
			'--fg-link:' . $tl->fg_link . ';' .
			'--hi-fg-link:' . $tl->hi_fg_link . ';' .
			'--bold-link:' . $tl->bold_link . ';';
	}

	public static function css($obj)
	{
		return
			'a  {
			color:var(--fg-link);
			font-weight:var(--bold-link);
		}' .  PHP_EOL . 
		'a:hover {
			color:var(--hi_fg-link);
		}
		';
	}
}

class ThemeHeaders
{
	public $fg_title;
	public $fsize_title;
	public $bold_title;
	public $align_title;
	public $fg_h;
	public $bold_h;
	public $align_h;
	public $fsize_h1;
	public $fsize_h2;
	public $fsize_h3;

	public static function stringify($th)
	{
		return json_encode($th);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($th)
	{
		return
			'--fg-title:' . $th->fg_title . ';' .
			'--fsize-title:' . $th->fsize_title . ';' .
			'--bold-title:' . $th->bold_title . ';' .
			'--align-title:' . $th->align_title . ';' .
			'--fg-h:' . $th->fg_h . ';' .
			'--bold-h:' . $th->bold_h . ';' .
			'--align-h:' . $th->align_h . ';' .
			'--fsize-h1:' . $th->fsize_h1 . ';' .
			'--fsize-h2:' . $th->fsize_h2 . ';' .
			'--fsize-h3:' . $th->fsize_h3 . ';';
	}


	public static function css($obj)
	{
		return
		'header  {
			color:var(--fg-title);
			font-size:var(--fsize-title);
			font-weight:var(--bold-title);
			text-align:center;
		}' .  PHP_EOL . 
		'title  {
			color:var(--fg-title);
			font-size:var(--fsize-title);
			font-weight:var(--bold-title);
			text-align:var(--align-title);
		}' .  PHP_EOL . 
		'h1  {
			color:var(--fg-h);
			font-weight:var(--bold-h);
			text-align:var(--align-h);
			font-size:var(--fsize-h1);
		}' .  PHP_EOL . 
		'h2  {
			color:var(--fg-h);
			font-weight:var(--bold-h);
			text-align:var(--align-h);
			font-size:var(--fsize-h2);
		}' .  PHP_EOL . 
		'h3  {
			color:var(--fg-h);
			font-weight:var(--bold-h);
			text-align:var(--align-h);
			font-size:var(--fsize-h3);
		}
		';
	}
}

class ThemeInput
{
	public $bg_inp;
	public $fg_inp;
	public $hi_bg_inp;
	public $hi_fg_inp;
	public $border_inp;
	public $radius_inp;
	public $shadow_inp;
	public $fsize_inp;

	public static function stringify($ti)
	{
		return json_encode($ti);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($ti)
	{
		return
			'--bg-inp:' . $ti->bg_inp . ';' .
			'--fg-inp:' . $ti->fg_inp . ';' .
			'--hi-bg-inp:' . $ti->hi_bg_inp . ';' .
			'--hi-fg-inp:' . $ti->hi_fg_inp . ';' .
			'--border-inp:' . $ti->border_inp . ';' .
			'--radius-inp:' . $ti->radius_inp . ';' .
			'--shadow-inp:' . $ti->shadow_inp . ';' .
			'--fsize-inp:' . $ti->fsize_inp . ';';
	}


	public static function css($obj)
	{
		return
			'input  {
			background:var(--bg-inp);
			color:var(--fg-inp);
			border:var(--border-inp);
			border-radius:var(--radius-inp);
			font-size:var(--fsize-inp);
		}' .  PHP_EOL . 
		'input:hover  {
			background:var(--hi-bg-inp);
			color:var(--hi-fg-inp);
		}' .  PHP_EOL . 
		'input:active  {
			background:var(--hi-bg-inp);
			color:var(--hi-fg-inp);
		}' .  PHP_EOL . 
		'select  {
			background:var(--bg-inp);
			color:var(--fg-inp);
			border:var(--border-inp);
			border-radius:var(--radius-inp);
			font-size:var(--fsize-inp);
		}' .  PHP_EOL . 
		'select:hover  {
			background:var(--hi-bg-inp);
			color:var(--hi-fg-inp);
		}' .  PHP_EOL . 
		'select:active  {
			background:var(--hi-bg-inp);
			color:var(--hi-fg-inp);
		}
		';
	}
}

class ThemeSections
{
	public $bg_block;
	public $fg_block;
	public $border_block;
	public $radius_block;
	public $shadow_block;
	public $fsize_block;

	public static function stringify($tb)
	{
		return json_encode($tb);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tb)
	{
		return
			'--bg-block:' . $tb->bg_block . ';' .
			'--fg-block:' . $tb->fg_block . ';' .
			'--border-block:' . $tb->border_block . ';' .
			'--radius-block:' . $tb->radius_block . ';' .
			'--shadow-block:' . $tb->shadow_block . ';' .
			'--fsize-block:' . $tb->fsize_block . ';';
	}

	public static function css($obj)
	{
		return
			'section  {
			background:var(--bg-block);
			color:var(--fg-block);
			border:var(--border-block);
			border-radius:var(--radius-block);
			font-size:var(--fsize-block);
		}
		';
	}
}

class ThemeQuote
{
	public $bg_quote;
	public $fg_quote;
	public $fstyle_quote;

	public static function stringify($tq)
	{
		return json_encode($tq);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tq)
	{
		return
			'--bg-quote:' . $tq->bg_quote . ';' .
			'--fg-quote:' . $tq->fg_quote . ';' .
			'--fstyle-quote:' . $tq->fstyle_quote . ';';
	}


	public static function css($obj)
	{
		return
			'blockquote  {
			background:var(--bg-quote);
			color:var(--fg-quote);
			font-style:var(--fstyle-quote);
		}
		';
	}
}

class ThemeCode
{
	public $bg_code;
	public $fg_code;
	public $font_code;
	public $fstyle_code;

	public static function stringify($tc)
	{
		return json_encode($tc);
	}

	public static function parse($json)
	{
		return json_decode($json);
	}

	public static function style($tc)
	{
		return
			'--bg-code:' . $tc->bg_code . ';' .
			'--fg-code:' . $tc->fg_code . ';' .
			'--font-code:' . $tc->font_code . ';' .
			'--fstyle-code:' . $tc->fstyle_code . ';';
	}


	public static function css($obj)
	{
		return
			'code  {
			background:var(--bg-code);
			color:var(--fg-code);
			font-family:var(--font-code);
			font-style:var(--fstyle-code);
		}
		';
	}
}

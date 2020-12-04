<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* themes/sltl/templates/page.html.twig */
class __TwigTemplate_7cc0880a53d8ecf104fa64d4badb68494434ea3498978d8c50239f4efcf18cdf extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
            'head' => [$this, 'block_head'],
            'featured' => [$this, 'block_featured'],
            'content' => [$this, 'block_content'],
            'footer' => [$this, 'block_footer'],
        ];
        $this->sandbox = $this->env->getExtension('\Twig\Extension\SandboxExtension');
        $tags = ["block" => 73, "if" => 97];
        $filters = ["t" => 71, "escape" => 99, "date" => 175];
        $functions = [];

        try {
            $this->sandbox->checkSecurity(
                ['block', 'if'],
                ['t', 'escape', 'date'],
                []
            );
        } catch (SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 69
        echo "<div id=\"page-wrapper\">
    <div id=\"page\">
        <header id=\"header\" class=\"header\" role=\"banner\" aria-label=\"";
        // line 71
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Site header"));
        echo "\">
            ";
        // line 73
        echo "            ";
        $this->displayBlock('head', $context, $blocks);
        // line 96
        echo "        </header>
        ";
        // line 97
        if ($this->getAttribute(($context["page"] ?? null), "highlighted", [])) {
            // line 98
            echo "        <div class=\"highlighted\">
            <aside class=\"";
            // line 99
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["container"] ?? null)), "html", null, true);
            echo " section clearfix\" role=\"complementary\">
                ";
            // line 100
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "highlighted", [])), "html", null, true);
            echo "
            </aside>
        </div>
        ";
        }
        // line 104
        echo "        ";
        if ($this->getAttribute(($context["page"] ?? null), "featured_top", [])) {
            // line 105
            echo "        ";
            $this->displayBlock('featured', $context, $blocks);
            // line 112
            echo "        ";
        }
        // line 113
        echo "        <div id=\"main-wrapper\" class=\"layout-main-wrapper clearfix\">
            ";
        // line 114
        $this->displayBlock('content', $context, $blocks);
        // line 141
        echo "        </div>
        ";
        // line 142
        if ((($this->getAttribute(($context["page"] ?? null), "featured_bottom_first", []) || $this->getAttribute(($context["page"] ?? null), "featured_bottom_second", [])) || $this->getAttribute(($context["page"] ?? null), "featured_bottom_third", []))) {
            // line 143
            echo "        <div class=\"featured-bottom\">
            <aside class=\"";
            // line 144
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["container"] ?? null)), "html", null, true);
            echo " clearfix\" role=\"complementary\">
                ";
            // line 145
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "featured_bottom_first", [])), "html", null, true);
            echo "
                ";
            // line 146
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "featured_bottom_second", [])), "html", null, true);
            echo "
                ";
            // line 147
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "featured_bottom_third", [])), "html", null, true);
            echo "
            </aside>
        </div>
        ";
        }
        // line 151
        echo "        <footer class=\"site-footer\">
           ";
        // line 152
        $this->displayBlock('footer', $context, $blocks);
        // line 182
        echo "        </footer>
    </div>
</div>";
    }

    // line 73
    public function block_head($context, array $blocks = [])
    {
        // line 74
        echo "            <section id=\"topPageBar\">
                <div class=\"container-fuid\">
                    <div class=\"row\">
                        <div class=\"col-sm-4\">
                            ";
        // line 78
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "topbarleft", [])), "html", null, true);
        echo "
                        </div>
                        <div class=\"col-sm-8 header-blue\">
                            ";
        // line 81
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "tobarright", [])), "html", null, true);
        echo "
                        </div>
                    </div>
                    <div class=\"row\">
                        <div class=\"col-sm-12 nofightingright\">
                            ";
        // line 86
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "secondheaderrow1", [])), "html", null, true);
        echo "
                        </div>
                        <div class=\"col-sm-12 \">
                            ";
        // line 89
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "secondheaderrow2", [])), "html", null, true);
        echo "
                        </div>
                    </div>
                </div>
            </section>
            ";
        // line 95
        echo "            ";
    }

    // line 105
    public function block_featured($context, array $blocks = [])
    {
        // line 106
        echo "        <div class=\"featured-top\">
            <aside class=\"featured-top__inner section ";
        // line 107
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["container"] ?? null)), "html", null, true);
        echo " clearfix\" role=\"complementary\">
                ";
        // line 108
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "featured_top", [])), "html", null, true);
        echo "
            </aside>
        </div>
        ";
    }

    // line 114
    public function block_content($context, array $blocks = [])
    {
        // line 115
        echo "            <div id=\"main\" class=\"";
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["container"] ?? null)), "html", null, true);
        echo "\">
                ";
        // line 116
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "breadcrumb", [])), "html", null, true);
        echo "
                <div class=\"row row-offcanvas row-offcanvas-left clearfix\">
                    <main ";
        // line 118
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["content_attributes"] ?? null)), "html", null, true);
        echo ">
                        <section class=\"section\">
                            <a id=\"main-content\" tabindex=\"-1\"></a>
                            ";
        // line 121
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "content", [])), "html", null, true);
        echo "
                        </section>
                    </main>
                    ";
        // line 124
        if ($this->getAttribute(($context["page"] ?? null), "sidebar_first", [])) {
            // line 125
            echo "                    <div ";
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["sidebar_first_attributes"] ?? null)), "html", null, true);
            echo ">
                        <aside class=\"section\" role=\"complementary\">
                            ";
            // line 127
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "sidebar_first", [])), "html", null, true);
            echo "
                        </aside>
                    </div>
                    ";
        }
        // line 131
        echo "                    ";
        if ($this->getAttribute(($context["page"] ?? null), "sidebar_second", [])) {
            // line 132
            echo "                    <div ";
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["sidebar_second_attributes"] ?? null)), "html", null, true);
            echo ">
                        <aside class=\"section\" role=\"complementary\">
                            ";
            // line 134
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "sidebar_second", [])), "html", null, true);
            echo "
                        </aside>
                    </div>
                    ";
        }
        // line 138
        echo "                </div>
            </div>
            ";
    }

    // line 152
    public function block_footer($context, array $blocks = [])
    {
        // line 153
        echo "        <section id=\"prefooter\">
         <div class=\"container\">
           <div class=\"row\">
             <div class=\"col-sm-5\">
               ";
        // line 157
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "prefooter1", [])), "html", null, true);
        echo "
             </div>
             <div class=\"col-sm-3\">
               ";
        // line 160
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "prefooter2", [])), "html", null, true);
        echo "
             </div>
             <div class=\"col-sm-4\">
               ";
        // line 163
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "prefooter3", [])), "html", null, true);
        echo "
             </div>
           </div>
         </div>
        </section>
        <section id=\"copyright\">
          <div class=\"container\">
            <div class=\"row\">
              <div class=\"col-sm-6\">
                ";
        // line 172
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "copyright1", [])), "html", null, true);
        echo "
              </div>
              <div class=\"col-sm-6\">
                <p>&copy; ";
        // line 175
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_date_format_filter($this->env, "now", "Y"), "html", null, true);
        echo " Students Loved for Life, Lexington NC</p>
              </div>
            </div>
          </div>
        </section>
        
";
    }

    public function getTemplateName()
    {
        return "themes/sltl/templates/page.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  301 => 175,  295 => 172,  283 => 163,  277 => 160,  271 => 157,  265 => 153,  262 => 152,  256 => 138,  249 => 134,  243 => 132,  240 => 131,  233 => 127,  227 => 125,  225 => 124,  219 => 121,  213 => 118,  208 => 116,  203 => 115,  200 => 114,  192 => 108,  188 => 107,  185 => 106,  182 => 105,  178 => 95,  170 => 89,  164 => 86,  156 => 81,  150 => 78,  144 => 74,  141 => 73,  135 => 182,  133 => 152,  130 => 151,  123 => 147,  119 => 146,  115 => 145,  111 => 144,  108 => 143,  106 => 142,  103 => 141,  101 => 114,  98 => 113,  95 => 112,  92 => 105,  89 => 104,  82 => 100,  78 => 99,  75 => 98,  73 => 97,  70 => 96,  67 => 73,  63 => 71,  59 => 69,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "themes/sltl/templates/page.html.twig", "/home/sltf/dev.studentslovedtolife.com/themes/sltl/templates/page.html.twig");
    }
}

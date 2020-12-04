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

/* themes/sltl/templates/page--front.html.twig */
class __TwigTemplate_09a8fb7600704433b6db45077d89e19822fff848c288e00ca49ac9c527c6ca62 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'head' => [$this, 'block_head'],
            'content' => [$this, 'block_content'],
            'footer' => [$this, 'block_footer'],
        ];
        $this->sandbox = $this->env->getExtension('\Twig\Extension\SandboxExtension');
        $tags = [];
        $filters = ["escape" => 75, "date" => 142];
        $functions = [];

        try {
            $this->sandbox->checkSecurity(
                [],
                ['escape', 'date'],
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

    protected function doGetParent(array $context)
    {
        // line 1
        return "@bootstrap_barrio/layout/page.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->parent = $this->loadTemplate("@bootstrap_barrio/layout/page.html.twig", "themes/sltl/templates/page--front.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 70
    public function block_head($context, array $blocks = [])
    {
        // line 71
        echo "        <section id=\"topPageBar\">
            <div class=\"container-fuid\">
                <div class=\"row\">
                    <div class=\"col-sm-4\">
                        ";
        // line 75
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "topbarleft", [])), "html", null, true);
        echo "
                    </div>
                    <div class=\"col-sm-8 header-blue\">
                        ";
        // line 78
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "tobarright", [])), "html", null, true);
        echo "
                    </div>
                </div>
                <div class=\"row\">
                    <div class=\"col-sm-12 nofightingright\">
                        ";
        // line 83
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "secondheaderrow1", [])), "html", null, true);
        echo "
                    </div>
                    <div class=\"col-sm-12 \">
                        ";
        // line 86
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "secondheaderrow2", [])), "html", null, true);
        echo "
                    </div>
                </div>
            </div>
        </section>
        ";
    }

    // line 93
    public function block_content($context, array $blocks = [])
    {
        // line 94
        echo "        <section id=\"Side-Social-Links\">
            ";
        // line 95
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "sidesociallinks", [])), "html", null, true);
        echo "
        </section>
        <section id=\"home-slider\">
            ";
        // line 98
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "slider", [])), "html", null, true);
        echo "
        </section>
        <section id=\"home-tagline\">
            <div class=\"container\">
                ";
        // line 102
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "tagline", [])), "html", null, true);
        echo "
            </div>
        </section>
        <section id=\"home-content\">
            <div class=\"container\">
                ";
        // line 107
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "content", [])), "html", null, true);
        echo "
            </div>
        </section>
        <section id=\"home-programs\">
            <div class=\"container\">
                ";
        // line 112
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "programs", [])), "html", null, true);
        echo "
            </div>
        </section>
        <section id=\"home-volunteer\">
            ";
        // line 116
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "volunteer", [])), "html", null, true);
        echo "
        </section>
        ";
    }

    // line 119
    public function block_footer($context, array $blocks = [])
    {
        // line 120
        echo "        <section id=\"prefooter\">
            <div class=\"container\">
                <div class=\"row\">
                    <div class=\"col-sm-5\">
                        ";
        // line 124
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "prefooter1", [])), "html", null, true);
        echo "
                    </div>
                    <div class=\"col-sm-3\">
                        ";
        // line 127
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "prefooter2", [])), "html", null, true);
        echo "
                    </div>
                    <div class=\"col-sm-4\">
                        ";
        // line 130
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
        // line 139
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "copyright1", [])), "html", null, true);
        echo "
                    </div>
                    <div class=\"col-sm-6\">
                        <p>&copy; ";
        // line 142
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
        return "themes/sltl/templates/page--front.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  193 => 142,  187 => 139,  175 => 130,  169 => 127,  163 => 124,  157 => 120,  154 => 119,  147 => 116,  140 => 112,  132 => 107,  124 => 102,  117 => 98,  111 => 95,  108 => 94,  105 => 93,  95 => 86,  89 => 83,  81 => 78,  75 => 75,  69 => 71,  66 => 70,  56 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "themes/sltl/templates/page--front.html.twig", "/home/sltf/dev.studentslovedtolife.com/themes/sltl/templates/page--front.html.twig");
    }
}

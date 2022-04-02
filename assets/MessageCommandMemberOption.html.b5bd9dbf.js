import{r as t,o as c,c as p,a as n,b as a,w as r,F as i,d as s,e as d}from"./app.98789376.js";import{_ as l}from"./plugin-vue_export-helper.21dcd24c.js";const u={},h=a("h1",{id:"messagecommandmemberoption",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#messagecommandmemberoption","aria-hidden":"true"},"#"),s(" MessageCommandMemberOption")],-1),m={id:"extends-messagecommandoption",tabindex:"-1"},k=a("a",{class:"header-anchor",href:"#extends-messagecommandoption","aria-hidden":"true"},"#",-1),_=s(" extends "),f=s("MessageCommandOption"),g=a("h2",{id:"methods",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#methods","aria-hidden":"true"},"#"),s(" Methods")],-1),x={id:"validate",tabindex:"-1"},b=a("a",{class:"header-anchor",href:"#validate","aria-hidden":"true"},"#",-1),v=s(),y=a("strong",null,"validate",-1),w=s(),M=d(`<h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4><ul><li><strong>option</strong>: <code>string</code></li></ul><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4><ul><li><code>Snowflake</code></li></ul><details class="custom-container details"><summary>TypeScript Source Code</summary><div class="language-typescript ext-ts"><pre class="language-typescript"><code><span class="token keyword">public</span> override <span class="token function">validate</span><span class="token punctuation">(</span>option<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> Snowflake <span class="token operator">|</span> <span class="token keyword">undefined</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> matches <span class="token operator">=</span> option<span class="token punctuation">.</span><span class="token function">matchAll</span><span class="token punctuation">(</span>MessageMentions<span class="token punctuation">.</span><span class="token constant">USERS_PATTERN</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>value<span class="token punctuation">;</span>
    <span class="token keyword">return</span> matches <span class="token operator">?</span> matches<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div></details>`,5);function C(S,B){const e=t("Badge"),o=t("RouterLink");return c(),p(i,null,[h,n(e,{type:"tip",text:"class",vertical:"middle"}),a("h4",m,[k,_,n(o,{to:"/references/MessageCommandOption.html"},{default:r(()=>[f]),_:1})]),g,a("h3",x,[b,v,y,w,n(e,{type:"tip",text:"override",vertical:"middle"})]),M],64)}var O=l(u,[["render",C]]);export{O as default};

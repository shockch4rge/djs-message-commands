import{r as t,o as p,c,a,b as n,w as i,F as r,d as s,e as l}from"./app.98789376.js";import{_ as d}from"./plugin-vue_export-helper.21dcd24c.js";const u={},k=n("h1",{id:"messagecommandstringoption",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#messagecommandstringoption","aria-hidden":"true"},"#"),s(" MessageCommandStringOption")],-1),h={id:"extends-messagecommandoptionchoiceable",tabindex:"-1"},m=n("a",{class:"header-anchor",href:"#extends-messagecommandoptionchoiceable","aria-hidden":"true"},"#",-1),_=s(" extends "),g=s("MessageCommandOptionChoiceable"),f=n("h2",{id:"methods",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#methods","aria-hidden":"true"},"#"),s(" Methods")],-1),x={id:"validate",tabindex:"-1"},y=n("a",{class:"header-anchor",href:"#validate","aria-hidden":"true"},"#",-1),b=s(),v=n("strong",null,"validate",-1),w=s(),C=l(`<h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4><ul><li><strong>option</strong>: <code>string</code></li></ul><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4><ul><li><code>string</code></li></ul><details class="custom-container details"><summary>TypeScript Source Code</summary><div class="language-typescript ext-ts"><pre class="language-typescript"><code><span class="token keyword">public</span> override <span class="token function">validate</span><span class="token punctuation">(</span>option<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">undefined</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> choice <span class="token keyword">of</span> <span class="token keyword">this</span><span class="token punctuation">.</span>choices<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>choice<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">===</span> option<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> choice<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">const</span> matches <span class="token operator">=</span> option<span class="token punctuation">.</span><span class="token function">matchAll</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^&quot;(.+)&quot;$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">gi</span></span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>value<span class="token punctuation">;</span>
    <span class="token keyword">return</span> matches <span class="token operator">?</span> matches<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div></details>`,5);function B(M,S){const e=t("Badge"),o=t("RouterLink");return p(),c(r,null,[k,a(e,{type:"tip",text:"class",vertical:"middle"}),n("h4",h,[m,_,a(o,{to:"/references/MessageCommandOptionChoiceable.html"},{default:i(()=>[g]),_:1})]),f,n("h3",x,[y,b,v,w,a(e,{type:"tip",text:"override",vertical:"middle"})]),C],64)}var V=d(u,[["render",B]]);export{V as default};

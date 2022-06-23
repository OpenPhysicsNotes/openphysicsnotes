---
title: formulario
---

## Eq. Schrodinger

### 1D

scuaibcubfi
$$
x^2
$$


<!--https://paolini.github.io/funplot/#q=%7B%22p%22%3A%7B%22x%22%3A0.16938156046883512%2C%22y%22%3A0.15627458421475948%2C%22r%22%3A2.545782103037746%7D%2C%22l%22%3A%5B%7B%22t%22%3A%22ode_system%22%2C%22ex%22%3A%222*y%22%2C%22ey%22%3A%22x%22%2C%22c%22%3A%22%234A90E2%22%2C%22sc%22%3A%22%237ED321%22%2C%22ds%22%3Atrue%2C%22gp%22%3Atrue%2C%22l%22%3A%5B%5D%7D%5D%7D
<iframe style="background: white; width:100%; height:50em" src="https://paolini.github.io/funplot/#q=%7B%22p%22%3A%7B%22x%22%3A0.16938156046883512%2C%22y%22%3A0.15627458421475948%2C%22r%22%3A2.545782103037746%7D%2C%22l%22%3A%5B%7B%22t%22%3A%22ode_system%22%2C%22ex%22%3A%222*y%22%2C%22ey%22%3A%22x%22%2C%22c%22%3A%22%234A90E2%22%2C%22sc%22%3A%22%237ED321%22%2C%22ds%22%3Atrue%2C%22gp%22%3Atrue%2C%22l%22%3A%5B%5D%7D%5D%7D"></iframe-->

<!--
dalla pubblicità di github copilot
const memoize = fn => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    return (cache[key] = cache[key] || fn(...args));
  };
}
-->

$$
p = \hbar k
$$

### Buca infinita:

annullamento ai bordi:
$$
\lambda = 2\frac{L}{n}; \;\;\; n = 1,2,3,...
$$
$$
k = \frac{2\pi}{\lambda} = n \frac{\pi}{L}
$$
$$
E = \frac{\hbar^2}{2m}k^2 = \frac{\hbar^2}{2m}k^2 \frac{\pi^2}{L^2} n^2
$$

### ???

Coeff Trasm. barriera a delta (repulsiva): $V = g \delta(x - a)$
$$
T = \frac{k}{k + i\beta} = \frac{1}{1 + i\frac{\beta}{k}}
$$

### Hellmann-Feynman

$$
\frac{\partial E_n}{\partial \lambda} = \braket{\psi_n(x, \lambda)|\frac{\partial H}{\partial \lambda}|\psi_n(x, \lambda)}
$${#eq:hellmann-feynman}
se ad esempio $H = H_0  + V$ e $V = \lambda V_0$, allora semplicemente:
$$
\delta E_n = \lambda\braket{\psi_n|V_0|\psi_n} = \braket{\psi_n|V|\psi_n}
$$

:::: todo
```
::: theorem <theorem-name>
...
:::
```
::::

:::: todo
issue, allow this:
```
::: a
:::: b
:::: c
:::
```
so that i can insert without modifying the external container, difficult to find
:::::

### barriera a delta

integrando in un intorno:
$$
\psi(0^+) = \psi(0^-) \;\;\; \psi'(0^+) - \psi'(0^-) = 2\beta\psi(0)
$$
con
$$
g = \frac{\hbar^2}{m} \beta
$$

## Oscillatore armonico

### Unità naturali
$$
-\frac{\hbar^2}{2m}\psi'' + \frac{1}{2} m \omega^2 x^2 \psi = E \psi
$${#eq:sch-ho-1d}

manipolo la <lc-ref ref="eq:sch-ho-1d">eq. </lc-ref>:
$$
\begin{split}
-\frac{1}{2}\psi'' + \frac{1}{2} \frac{m^2 \omega^2}{\hbar^2} x^2 \psi &= E\frac{m}{\hbar^2} \psi\\
-\frac{1}{2}\psi'' + \frac{1}{2} \frac{x^2}{\ell^2}\frac{1}{\ell^2} \psi &= \epsilon\, \psi\\
-\frac{1}{2}\psi'' + \frac{1}{2} \frac{z^2}{\ell^2} \psi &= \epsilon\, \psi
\end{split}
$$
da cui definisco:
$$
\ell^2 = \frac{\hbar}{m\omega}; \;\; z = \frac{x}{\ell}; \;\; \epsilon = E \frac{m}{\hbar^2}
\\
\ell = \text{lungh. caratt.}
$$

## WKB

$$
p = \sqrt{2mE\left(E - V(x)\right)}
$$
osc. armonico:
$$
p = \sqrt{2mE\left(E - \frac{1}{2} m \omega^2 x^2 \right)}
$$
per cui:
$$
a^2 = \frac{2E}{m\omega^2}
$$

### Perturb livelli

$$
\delta E_n = \overline{\delta V}
$$
(media temporale di $V$)
ad esempio
$$
\overline{\delta V} = \frac{1}{T} \oint \delta V dt = \frac{1}{T} \oint \delta V(x) \frac{m}{\sqrt{2m\left(E - V(x)\right)}} dx
$$
ad esempio osc armonico: $T = 2\pi / \omega$

Tutto questo equivale a calcolare il valore medio temporale classico, quindi se ho $x_{cl}(t)$
posso fare semplicemente $\frac{1}{T} \int_0^T x_{cl}(t) \, dt$, ad esempio per l'osc: $x_{cl}(x) = a \cos (\omega t)$

### Tra due buche:

<!-- scrivi che in markdown-it sia $ che $$ sono considerati inline per fare in modo che siano o no nello stesso paragrafo e non blocchi esterni al paragrafo -->
$$
\Delta E = \frac{2\hbar}{\tau}|T|
$$

### Stati metastabile

::: def
$E_0$ energia approx con prob. di dec. per unità di tempo $\gamma$.  
$$
|\braket{\psi | \psi_t}|^2 = e^{-\gamma t}
$$
:::

barriera $U_0$, $d$
$$
T \simeq \exp\left(- \frac{1}{\hbar} \int_0^d\sqrt{2m(U(x) - E)}\right) = e^{- \frac{d}{\hbar} \sqrt{2m(U_0 - E)}}
$$


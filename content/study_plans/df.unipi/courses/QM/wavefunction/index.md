---
title: Quantum Wave Function and Operators
related_articles:
    - title: Exercises
      href: ./exercises/
---

# Quantum wave function and operators

## Wave Function

_De Broglie_ relation:
$$
  \lambda = \frac{h}{p}
$${#eq:de-broglie}

$\Longrightarrow$ we can describe the state of the system not in terms of simultaneous values of all canonical variables $\left\{ p,\, q \right\}$ as in classical mechanics but in a sort of wave.

::: note
**The fundamental law of quantum mechanics:**  
*the quantum state of a given system is described by a complex function called **wave function**:*
$$
    \text{quantum state} \sim \psi(\{q\}, t)
$$
*That depends on the canonical coordinates and the time but not the conjugate momenta*
:::

The knowledge of the wave function amounts to the complete knowledge of the quantum state of the system, thus we can determine the probability of getting any measurement made in this state.

The quantum wave function does not represents a classical wave, its interpretation is purely probabilistic: the quantum mechanical probability of finding the system in the coordinate interval $[q, q + dq]$ is given by:
$$
    dP = \left|\psi(\{q\}, t)\right|^2 dq
$$

As the total probability must be 1, we must impose the *normalization condition*:
$$
    \left||\psi\right||^2 = \int \left|\psi(\{q\}, t)\right|^2 dq = 1
$${#eq:norm-condition}
We call any $\psi$ for which the integral $\int \left|\psi(\{q\}, t)\right|^2 dq$ is finite *normalizable* (and we say $\psi \sim c\psi$ as they represents the same physical quantum state).

::: warning
Non normalizable wave functions such as $\psi(\mathbf{r}, t) = e^{+r^{2}}$ do not represents any physical state.
:::

:::: note
This is the same sa saying: *the quantum state is described by a ***ray*** in the *Hilbert space* $\mathcal{H}$*.

$$
\psi \in \mathcal{H} \,\, \Longrightarrow \,\, \int |\psi|^{2} \lt \infty
$$
i.e. they must be square integrable ($\in \mathbb{L}^{2}$).

::: todo
OSS
:::

::::


In QM, $\psi \sim c\psi$, while two classical waves differing by an amplitude factor describes different phenomena (for example different intensity).

### The superposition principle

::: note
**The superposition principle**

Given $\psi_1$, $\psi_2$ quantum states, the linear combination
$$
    \psi = c_1\psi_1 + c_2\psi_2
$${#eq:superposition-principle}
where $c_1, c2 \in \mathbb{C}$, $|c_1|^{2} + |c_2|^{2} \neq 0$, is also a *quantum state*.
:::

### Scalar product

$$
  \braket{\psi_1 | \psi_2} = \int \psi_1^{*}\,\psi_2 \, dq
$$
$$
  ||\psi|| = \sqrt{\braket{\psi | \psi}}
$$

## Time evolution

For consistency with the superposition principle, we require that the  time evolution operator can be written in the form:
$$
    \mathcal{L}\psi = 0
$$
where $\mathcal{L}$ is a *linear operator*

## Measurements

if $a$, $b$ the two possible outcomes of the observation of a variable $O$, with associated states $A$, $b$, if we prepare a state:
$$
\ket{C} = c_A \ket{A} + c_b \ket{B}
$$
where $|c_A|^{2} + |c_B|^{2} \neq 0$, then:
$$
\mathcal{P}_a = \frac{|c_A|^{2}}{|c_A|^{2} + |c_B|^{2}} ; \,\,\,\,
\mathcal{P}_b = \frac{|c_B|^{2}}{|c_A|^{2} + |c_B|^{2}}
$$

## Composite systems

A, B *non-interacting* and *uncorrelated* subsystems, the wave function takes a factorized form:
$$
  \psi_{A, B} = \psi_A \psi_B
$$
This leads to the factorized probabilities, reflecting the independence of the two subsystems.

## Photon polarization

Monochromatic light:
$$
  \mathbf{A} = A^{\lambda} \\, {\epsilon}^{\lambda} e^{i\left(\mathbf{k}\cdot\mathbf{r} - \omega t\right)} + c.c.
$$
in the radiation gauge (<a href="https://physics.stackexchange.com/questions/332157/radiation-gauge-and-choice-of-the-gauge-function">Coulomb Gauge</a>):
$$
  \mathbf{E} = -\frac{1}{c} \frac{\partial \mathbf{A}}{\partial t}
  ,\;\;\;\;
  \mathbf{B} = \mathbf{\nabla} \times \mathbf{A}
  ,\;\;\;\;
  \mathbf{\epsilon} \cdot \mathbf{k} = 0
$$
<lc-todo>
  RISTUDIA LE GAUGE E VERIFICA
</lc-todo>
this means that, give $\mathbf{k}$, the allowed $\mathbf{\epsilon}$ vectors live in a 2-dim subspace i.e. *there are **two independent** possible **polarizations***.

For example: linear polarization in the $\mathbf{x}$ direction ($\mathbf{\epsilon^1} = (1, 0, 0)$, $\mathbf{k} = (0, 0, 1)$):
$$
    E_x = \frac{A^1}{c}\omega \cos(\mathbf{k}\cdot\mathbf{r} - \omega t),
    \;\;\;\;\;
    E_y = 0
$$

For the $\mathbf{y}$ direction it is the same with $\mathbf{\epsilon^2} = (0, 1, 0)$, $\mathbf{k} = (0, 0, 1)$.

Circular polarization can be described with, for example, $\mathbf{\epsilon^1} = \frac{1}{\sqrt{2}}(1, i, 0)$.

In Q.M. light is a flux of photons and their polarization is due to two possible quantum states of a photon of given momentum (i.e. given wavelength and direction of propagation).

::: todo
continua...
:::

## Uncertainty principle

**Uncertainty relations**:
$$
  \Delta{x} \cdot \Delta p_x \geq \frac{\hbar}{2}
  ,\;\;\;\;
  \Delta{y} \cdot \Delta p_y \geq \frac{\hbar}{2}
  ,\;\;\;\;
  \Delta{z} \cdot \Delta p_z \geq \frac{\hbar}{2}
$${.squared-red}

::: note
<details>
  <summary>Verifica per pacchetto gaussiano</summary>
  <tex-math>
    \psi(x, 0) = c. \; e^{-{x^2}/{d^2}}
  </tex-math>
  we can calculate:
  <tex-math>
    \Delta x
    = \text{std.dev.}(x)
    = \sqrt{\left\lt(x - \left\lt x\right\gt^2\right\gt}
    \sim d
  </tex-math>
  <lc-note>
    <details>
      <summary>calculation</summary>
      <lc-todo>todo</lc-todo>
    </details>
  </lc-note>
  <tex-math>
    \psi(x) = \int_{-\infty}^\infty a(\lambda) \; e^{2\pi i x / \lambda}
  </tex-math>
  Now, if <i-math>\hbar = h / 2\pi</i-math> and <i-math>p = \frac{h}{\lambda}</i-math>:
  <tex-math>
    \frac{1}{\lambda} = \frac{p}{h} = \frac{p}{\hbar 2\pi}
  </tex-math>
  and then:
  <tex-math>
    \begin{split}
      \psi(x)
      &= \int_{-\infty}^\infty a(\lambda) \; e^{2\pi i x / \lambda} d\lambda\\
      &= \int_{-\infty}^\infty a(\lambda) \; e^{2\pi i x p / h} d\lambda\\
      &= \int_{-\infty}^\infty a(\lambda) \; e^{i p x / \hbar} d\lambda\\
      &= \int_{-\infty}^\infty \widetilde{\psi}(p) \; e^{i p x / \hbar} dp
    \end{split}
  </tex-math>
  to understand what is $\widetilde{\psi}$:
  <tex-math>
    \lambda = \frac{2 \pi \hbar}{p}
    \;\; \Longrightarrow \;\;
    d\lambda = d\left(\frac{2 \pi \hbar}{p}\right) = -\frac{2 \pi \hbar}{p^2} dp
  </tex-math>
  then:
  <tex-math>
    a(\lambda) d\lambda = \widetilde{\psi}(p) dp
    \;\; \Longrightarrow \;\;
    \widetilde{\psi}(p) = ............
  </tex-math>
  <tex-math>
    \widetilde{\psi}(p) \propto a(\lambda) = a\left(\frac{h}{p}\right)
  </tex-math>
  For a gaussian wave, $\widetilde{\psi}$ can be easily calculated with the Fourier transform:
  <lc-todo>
    CALCOLA
  </lc-todo>
  <tex-math>
    \widetilde{\psi}(p) = \int_{-\infty}^\infty %\frac
  </tex-math>
  <lc-todo>
    continua
  </lc-todo>
</details>
:::

## Fundamental postulate

How are dynamic variables threated in such formalism?  

In QM, each dynamic variable $f$ is associated with a linear operator $\hat{f}$, that, by definition:
<tex-math>
\hat{f}(c_1 \psi_1 + c_1 \psi_1) = c_1 \hat{f} \psi_1 + c_1 \hat{f} \psi_2
</tex-math>

<tex-math>
\braket{q}_\psi = \int dq |\psi(q)|^2 = \int dq \psi(q)^* q \, \psi(q)
</tex-math>

For any function of the position variable $f(q)$, wa can analogously assign a linear operator $\hat{f}$:
<tex-math>
\hat{q} \\, \psi(q) = q \\, \psi{q}; \\;\\;\\; \hat{f}\psi(q) = f(\hat{q})\psi(q) = f(q)\psi(q)
</tex-math>
so that its expectation value is given according to:
<tex-math>
\braket{\psi|\hat{f}|\psi} = \int dq \psi(q)^* \hat{f} \\, \psi(q)
</tex-math>

...

<tex-math>
\hat{f}\psi_n = f_n\psi_n; \;\;\; ||\psi_n|| = 1
</tex-math>

Where $\psi_n$ represents an eigenfunction relative to the eigenvalue $f_n$, it is known as the *eigenstate* of $f$. In such state there is indeed no dispersion:
<tex-math>
\braket{\psi_n | \hat{f}^2 | \psi_n} - \braket{\psi_n | \hat{f} | \psi_n}^2 = 0
</tex-math>
::: details proof
<tex-math>
\begin{split}
\braket{\psi_n | \hat{f}^2 | \psi_n} - \braket{\psi_n | \hat{f} | \psi_n}^2 &=
\braket{\psi_n | \hat{f}^2 \psi_n} - \braket{\psi_n | \hat{f} \psi_n}^2 \\
&= \braket{\psi_n | \hat{f} f_n \psi_n} - \braket{\psi_n | f_n \psi_n}^2 \\
&= \braket{\psi_n | f_n \hat{f} \psi_n} - \braket{\psi_n | f_n \psi_n}^2 \\
&= \braket{\psi_n | f_n^2 \psi_n} - \braket{\psi_n | f_n \psi_n}^2 \\
&= f_n^2 \braket{\psi_n | \psi_n} - f_n^2 \braket{\psi_n | \psi_n}^2 \\
&= f_n^2 - f_n^2 \\
&= 0
\end{split}
</tex-math>
:::

A generic state:
<tex-math>
\psi(q) = \sum_n c_n \\, \psi_n(q)
</tex-math>
con $||\psi_n|| = 1$.

:::: note
->**fundamental postulate of quantum mechanics**<-
The probability of finding a result $f_n$ for the measurement of $f$ on $\psi(q) = \sum_n c_n \, \psi_n(q)$ is:
<tex-math>
P_n = |c_n|^2
</tex-math>
::: todo
DEF
:::
::::

Orthogonality of eigenstates:
<tex-math>
\braket{\psi_n|\psi_m} = \int dq \psi_n^*\psi_m = \delta_{n,m}
</tex-math>
...
expectation value:
<tex-math>
\braket{\psi_n|\hat{f}|\psi_m} = ... = \sum_n P_n f_n
</tex-math>

remember:
<tex-math>
\braket{\psi_n|\psi} = c_n
</tex-math>

::: note
(postulate) the state immediately after the measurement resulted in $f_n$ is $\ket{\psi_n} \equiv \ket{n}$

<!-- TODO quella riga sopra funziona se c'è un carattere dopo o spazio prima di $ !!!!-->

<tex-math>
P_n = \braket{\psi|\mathcal{P}_n|\psi}
</tex-math>
:::

## Hermitian operators

- transposed $\hat{f}^T$
- hermitian conjugate $\hat{f}^\dag = (\hat{f}^T)^*$

*Hermitian operator*:
<tex-math>
\braket{\phi|\hat{f}\psi} = \braket{\psi|\hat{f}\phi}^* = \braket{\hat{f}\phi|\psi}
\\;\\; \forall \psi, \phi \in \mathcal{D}(\hat{f})
</tex-math>

::: note
Any *dynamical variable* (*real* expectation value) is associated with an *hermitian operator*
:::


::: todo
continua...
:::

**Teo.**: *The eigenstates of an Hermitian operator, associated with distinct eigenvalues, are mutually orthogonal*.

::: todo
proof
:::

### Position and momentum operators

position operator:
$$
\hat{x} \psi(x, t) = x \psi(x, t)
$$

momentum operator:
$$
\hat{p} = -i \hbar \frac{\partial}{\partial x}
$$
$$
\mathbf{p} = -i \hbar \mathbf{\nabla}
$$
::: details proof {open}
p. de broglie: $\psi \sim e^{i(px - wt)/\hbar} \Rightarrow p \sim \frac{\hbar}{i}\frac{d}{dx} \psi$
:::

$$
\left[\hat{x}, \hat{p}\right] = i \hbar
$$

::: todo
proof
:::

[]: # Language: markdown
[]: # Path: content\a\b\index.md

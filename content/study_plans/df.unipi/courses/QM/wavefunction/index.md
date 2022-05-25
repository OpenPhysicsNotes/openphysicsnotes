---
title: Quantum Wave Function and Operators
related_articles:
    - title: Exercises
      href: ./exercises/
---

# Quantum wave function and operators

## Wave Function

_De Broglie_ relation:
<tex-math id="eq:de-broglie">
  \lambda = \frac{h}{p}
</tex-math>

$\Longrightarrow$ we can describe the state of the system not in terms of simultaneous values of all canonical valiables $\left\{ p,\, q \right\}$ as in classical mechanics but in a sort of wave.

::: note
**The foundamental law of quantum mechanics:**  
*the quantum state of a given system is described by a complex function called **wave function**:*
$$
    \text{quantum state} \sim \psi(\{q\}, t)
$$
*That depends on the canonical coordinates and the time but not the cojugate momenta*
:::

The knowledge of the wave function amounts to the complete knowledge of the quantum state of the system, thus we can determine the probability of getting any measurement made in this state.

The quantum wave function does not represents a classical wave, its interpretation is purely probabilistic: the quantum mechanical probability of finding the system in the coordinate interval $[q, q + dq]$ is given by:
<tex-math>
    dP = \left|\psi(\{q\}, t)\right|^2 dq
</tex-math>

As the total probability must be 1, we must impose the *normalization condition*:
<tex-math id="eq:norm-condition">
    \left||\psi\right||^2 = \int \left|\psi(\{q\}, t)\right|^2 dq = 1
</tex-math>
We call any $\psi$ for which the integral $\int \left|\psi(\{q\}, t)\right|^2 dq$ is finite *normalizable* (and we say $\psi \sim c\psi$ as thay represents the same physical quantum state).

::: warning
Non normalizable wave funcitons such as $\psi(\mathbf{r}, t) = e^{+r^{2}}$ do not represents any physical state.
:::

::: note
This is the same sa saying: *the quantum state is described by a ***ray*** in the *Hilbert space* $\mathcal{H}$*.

<tex-math>
\psi \in \mathcal{H} \,\, \Longrightarrow \,\, \int |\psi|^{2} \lt \infty
</tex-math>
i.e. they must be square integrable ($\in \mathbb{L}^{2}$).

::: todo
OSS
:::

:::


In QM, $\psi \sim c\psi$, while thwo calssical waves differing by an amplitude factor describes different fenomena (for example different intensity).

### The superposition principle

::: note
**The superposition principle**

Given $\psi_1$, $\psi_2$ quantum states, the linear combination
<tex-math id="eq:superposition-principle">
    \psi = c_1\psi_1 + c_2\psi_2
</tex-math>
where $c_1, c2 \in \mathbb{C}$, $|c_1|^{2} + |c_2|^{2} \neq 0$, is also a *quantum state*.
:::

### Scalar product

<tex-math>
  \braket{\psi_1 | \psi_2} = \int \psi_1^{*}\,\psi_2 \, dq
</tex-math>

<tex-math>
  ||\psi|| = \sqrt{\braket{\psi | \psi}}
</tex-math>.

## Time evolution

For consistency with the superposition principle, we require that the  time evolution operator can be written in the form:
<tex-math>
    \mathcal{L}\psi = 0
</tex-math>
where $\mathcal{L}$ is a *linear operator*

## Measurements

if $a$, $b$ the two possible outcomes of the observation of a variable $O$, with associated states $A$, $b$, if we prepare a state:
<tex-math>
\ket{C} = c_A \ket{A} + c_b \ket{B}
</tex-math>
where $|c_A|^{2} + |c_B|^{2} \neq 0$, then:
<tex-math>
\mathcal{P}_a = \frac{|c_A|^{2}}{|c_A|^{2} + |c_B|^{2}} ; \\,\\,\\,\\,
\mathcal{P}_b = \frac{|c_B|^{2}}{|c_A|^{2} + |c_B|^{2}}
</tex-math>

## Composite systems

A, B *non-interacting* and *uncorrelated* subsystems, the wave function takes a factorized form:
<tex-math>
  \psi_{A, B} = \psi_A \psi_B
</tex-math>
This leads to the factorized probabilities, refflecting the independence of the two subsystems.

## Photon polarization

Monochromatic light:
<tex-math>
  \mathbf{A} = A^{\lambda} \\, {\epsilon}^{\lambda} e^{i\left(\mathbf{k}\cdot\mathbf{r} - \omega t\right)} + c.c.
</tex-math>
in the radiation gauge (<a href="https://physics.stackexchange.com/questions/332157/radiation-gauge-and-choice-of-the-gauge-function">Coulomb Gauge</a>):
<tex-math>
  \mathbf{E} = -\frac{1}{c} \frac{\partial \mathbf{A}}{\partial t}
  ,\\;\\;\\;\\;
  \mathbf{B} = \mathbf{\nabla} \times \mathbf{A}
  ,\\;\\;\\;\\;
  \mathbf{\epsilon} \cdot \mathbf{k} = 0
</tex-math>
<lc-todo>
  RISTUDIA LE GAUGE E VERIFICA
</lc-todo>
this means that, give $\mathbf{k}$, the allowed $\mathbf{\epsilon}$ vectors live in a 2-dim subspace i.e. *there are **two indipendent** possible **polarizations***.

For example: linear polarization in the $\mathbf{x}$ direction ($\mathbf{\epsilon^1} = (1, 0, 0)$, $\mathbf{k} = (0, 0, 1)$):
<tex-math>
    E_x = \frac{A^1}{c}\omega \cos(\mathbf{k}\cdot\mathbf{r} - \omega t),
    \\;\\;\\;\\;\\;
    E_y = 0
</tex-math>

For the $\mathbf{y}$ direction it is the same with $\mathbf{\epsilon^2} = (0, 1, 0)$, $\mathbf{k} = (0, 0, 1)$.

Circular polarization can be described with, for example, $\mathbf{\epsilon^1} = \frac{1}{\sqrt{2}}(1, i, 0)$.

In Q.M. light is a flux of photons and their polarization is due to two possible quantum states of a photon of gievn momentum (i.e. given wavelenght and direction of propagation).

::: todo
continua...
:::

## Uncertainty principle

**Uncertainty relations**:
<tex-math style="border: solid 1px red; margin: 0.5em;">
  \Delta{x} \cdot \Delta p_x \geq \frac{\hbar}{2}
  ,\\;\\;\\;\\;
  \Delta{y} \cdot \Delta p_y \geq \frac{\hbar}{2}
  ,\\;\\;\\;\\;
  \Delta{z} \cdot \Delta p_z \geq \frac{\hbar}{2}
</tex-math>

<lc-note>
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
      Now, if $\hbar = h / 2\pi$ and $p = \frac{h}{\lambda}$:
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
      to undestand what is $\widetilde{\psi}$:
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
</lc-note>

## Foundamental Postulate

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

Where $\psi_n$ eigenfuction represents

i.e. 

::: todo
continua...
:::



::: todo
use https://github.com/camelaissani/markdown-it-include
:::

[]: # Language: markdown
[]: # Path: content\a\b\index.md
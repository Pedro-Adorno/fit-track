# Modelos anatômicos (Open Anatomy 3D)

O FitTrack procura `public/models/body-male.glb` e `public/models/body-female.glb`. Sem eles o app mostra um aviso (não desenha substitutos).

## Gerar os arquivos otimizados (na sua máquina, com internet)
```bash
mkdir -p models-src
curl -L https://cdn.jsdelivr.net/npm/open-anatomy-3d@0.1.0/models/anatomy-male.glb   -o models-src/anatomy-male.glb
curl -L https://cdn.jsdelivr.net/npm/open-anatomy-3d@0.1.0/models/anatomy-female.glb -o models-src/anatomy-female.glb
npm i -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer
node scripts/optimize-model.mjs models-src/anatomy-male.glb   public/models/body-male.glb   0.2
node scripts/optimize-model.mjs models-src/anatomy-female.glb public/models/body-female.glb 0.2
```
- O script remove esqueleto, órgãos, vasos e nervos, mantém pele e músculos com os nomes originais, simplifica (razão 0.2 = ~20% dos triângulos; ajuste até ~150 mil) e comprime com meshopt (o app já decodifica).
- Ele imprime os triângulos finais e os **nomes das malhas preservadas**. Confira o tamanho (meta ≤ 5 MB) e, se algum músculo não for reconhecido, ajuste `src/muscleMap.ts` ou use "Ajustar nomes dos músculos do modelo" no app.
- Estrutura esperada do modelo: nós nomeados pela chave do catálogo, agrupados por nós de sistema (`skin`, `muscles`, ...). Se os nomes dos grupos forem outros, ajuste a lista em `src/Hologram.tsx`.

## Licença e créditos (obrigatórios)
Modelos: Open Anatomy 3D (https://github.com/MervinR07/open-anatomy-3d), **CC BY 4.0** (https://creativecommons.org/licenses/by/4.0/), adaptados de BodyParts3D (© DBCLS, CC BY 4.0), Human Reference Atlas 3D (HuBMAP, CC BY 4.0) e MakeHuman (CC0).
Modificações feitas pelo FitTrack: remoção de esqueleto, órgãos, vasos e nervos; simplificação de geometria; compressão meshopt; material holográfico aplicado em tempo de execução.
O crédito também aparece no rodapé do módulo Corpo 3D. Não remova. Uso apenas educativo/visual; não é dispositivo médico.

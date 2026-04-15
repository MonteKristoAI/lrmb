export interface QualityGate {
  name: string;
  passed: boolean;
  current: string | number;
  required: string;
  severity: 'blocker' | 'warning';
}

export interface QualityGateResult {
  allPassed: boolean;
  blockersPassed: boolean;
  gates: QualityGate[];
}

export interface PostForGating {
  em_dash_count: number | null;
  banned_words_found: string[] | null;
  featured_image_url: string | null;
  seo_title: string | null;
  meta_description: string | null;
  external_link_count: number | null;
  word_count: number | null;
}

export function checkQualityGates(post: PostForGating): QualityGateResult {
  const gates: QualityGate[] = [
    {
      name: 'Zero em dashes',
      passed: (post.em_dash_count ?? 0) === 0,
      current: post.em_dash_count ?? 0,
      required: '0',
      severity: 'blocker',
    },
    {
      name: 'No banned words',
      passed: (post.banned_words_found ?? []).length === 0,
      current: (post.banned_words_found ?? []).length === 0
        ? 'none'
        : (post.banned_words_found ?? []).join(', '),
      required: 'none',
      severity: 'blocker',
    },
    {
      name: 'Featured image set',
      passed: !!post.featured_image_url,
      current: post.featured_image_url ? 'set' : 'missing',
      required: 'set',
      severity: 'blocker',
    },
    {
      name: 'SEO title length',
      passed: (post.seo_title?.length ?? 0) >= 40 && (post.seo_title?.length ?? 0) <= 65,
      current: `${post.seo_title?.length ?? 0} chars`,
      required: '40-65 chars',
      severity: 'blocker',
    },
    {
      name: 'Meta description length',
      passed: (post.meta_description?.length ?? 0) >= 140 && (post.meta_description?.length ?? 0) <= 165,
      current: `${post.meta_description?.length ?? 0} chars`,
      required: '140-165 chars',
      severity: 'warning',
    },
    {
      name: 'External links',
      passed: (post.external_link_count ?? 0) >= 3,
      current: post.external_link_count ?? 0,
      required: '>= 3',
      severity: 'warning',
    },
    {
      name: 'Word count',
      passed: (post.word_count ?? 0) >= 2000,
      current: `${post.word_count ?? 0}`,
      required: '>= 2000',
      severity: 'warning',
    },
  ];

  const blockersPassed = gates
    .filter(g => g.severity === 'blocker')
    .every(g => g.passed);

  return {
    allPassed: gates.every(g => g.passed),
    blockersPassed,
    gates,
  };
}

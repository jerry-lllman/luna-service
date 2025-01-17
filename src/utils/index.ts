function compareVersion(version1: string, version2: string) {
  const v1 = version1.split('.').map(Number)
  const v2 = version2.split('.').map(Number)

  const maxLength = Math.max(v1.length, v2.length)
  for (let i = 0; i < maxLength; i++) {
    const v1Num = v1[i] ?? 0
    const v2Num = v2[i] ?? 0

    if (v1Num > v2Num)
      return 1
    if (v1Num < v2Num)
      return -1
  }
  return 0
}

/**
 * 比较版本号
 * @param versions 版本号数组
 * @returns 排序后的版本号数组
 * @example
 * compareVersions(['1.0.0', '2.0.0', '1.1.0']) // ['1.0.0', '1.1.0', '2.0.0']
 */
export function compareVersions(versions: string[]) {
  return versions.sort(compareVersion)
}

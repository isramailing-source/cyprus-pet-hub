import React from 'react';
import { buildAffiliateUrl, DEFAULT_AMAZON_TAG, AffiliateLink } from './PetProductShowcase';

/**
 * Test component to verify affiliate URL generation and link functionality
 * This ensures all links properly append the cypruspets20-20 tracking tag
 */
export function AffiliateUrlTest() {
  // Test data - sample ASINs from the PetProductShowcase
  const testProducts = [
    { id: 'B074Q7P389', name: 'YETI Boomer 8 Dog Bowl' },
    { id: 'B06XKZX9VB', name: 'SmartyKat Hot Pursuit Cat Toy' },
    { id: 'B00176F5L0', name: 'Prevue Pet Products Cage Kit' },
    { id: 'B0002AR0I8', name: 'Kong Classic Dog Toy' }
  ];

  // Test URL generation
  const testUrlGeneration = () => {
    const results = [];
    
    for (const product of testProducts) {
      const url = buildAffiliateUrl({
        partner: 'amazon',
        asin: product.id,
        tag: DEFAULT_AMAZON_TAG
      });
      
      const isValid = url && url.includes('tag=cypruspets20-20');
      results.push({
        product: product.name,
        asin: product.id,
        url,
        hasCorrectTag: isValid,
        status: isValid ? '✅ PASS' : '❌ FAIL'
      });
    }
    
    return results;
  };

  // Test edge cases
  const testEdgeCases = () => {
    return [
      {
        case: 'Missing ASIN',
        url: buildAffiliateUrl({ partner: 'amazon', asin: '', tag: DEFAULT_AMAZON_TAG }),
        expected: 'null (no URL generated)',
        status: buildAffiliateUrl({ partner: 'amazon', asin: '', tag: DEFAULT_AMAZON_TAG }) === null ? '✅ PASS' : '❌ FAIL'
      },
      {
        case: 'Missing tag (should use default)',
        url: buildAffiliateUrl({ partner: 'amazon', asin: 'B074Q7P389' }),
        expected: 'URL with cypruspets20-20 tag',
        status: buildAffiliateUrl({ partner: 'amazon', asin: 'B074Q7P389' })?.includes('tag=cypruspets20-20') ? '✅ PASS' : '❌ FAIL'
      },
      {
        case: 'Custom query parameters',
        url: buildAffiliateUrl({ 
          partner: 'amazon', 
          asin: 'B074Q7P389', 
          tag: DEFAULT_AMAZON_TAG,
          query: { ref: 'sr_1_1', keywords: 'dog bowl' }
        }),
        expected: 'URL with additional params + tag',
        status: (() => {
          const url = buildAffiliateUrl({ 
            partner: 'amazon', 
            asin: 'B074Q7P389', 
            tag: DEFAULT_AMAZON_TAG,
            query: { ref: 'sr_1_1', keywords: 'dog bowl' }
          });
          return url?.includes('tag=cypruspets20-20') && url?.includes('ref=sr_1_1') ? '✅ PASS' : '❌ FAIL';
        })()
      }
    ];
  };

  const urlTests = testUrlGeneration();
  const edgeTests = testEdgeCases();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Affiliate URL Test Results</h1>
      
      {/* URL Generation Tests */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">URL Generation Tests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">ASIN</th>
                <th className="px-4 py-2 text-left">Generated URL</th>
                <th className="px-4 py-2 text-left">Has cypruspets20-20?</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {urlTests.map((test, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{test.product}</td>
                  <td className="px-4 py-2 font-mono text-sm">{test.asin}</td>
                  <td className="px-4 py-2">
                    {test.url ? (
                      <a 
                        href={test.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-xs break-all"
                      >
                        {test.url}
                      </a>
                    ) : (
                      <span className="text-gray-500">No URL generated</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{test.hasCorrectTag ? '✅ Yes' : '❌ No'}</td>
                  <td className="px-4 py-2 font-semibold">{test.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edge Case Tests */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edge Case Tests</h2>
        <div className="space-y-4">
          {edgeTests.map((test, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">{test.case}</h3>
                <span className="font-semibold">{test.status}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Expected:</strong> {test.expected}
              </div>
              <div className="text-sm text-gray-800">
                <strong>Result:</strong> {test.url || 'null'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Component Tests */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Component Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testProducts.map((product, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">ASIN: {product.id}</p>
              
              {/* Test AffiliateLink component */}
              <AffiliateLink
                partner="amazon"
                asin={product.id}
                className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded transition-colors"
              >
                🛒 Test Link (opens Amazon with tracking)
              </AffiliateLink>
              
              <div className="mt-2 text-xs text-gray-500">
                Should include: tag=cypruspets20-20
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="bg-blue-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Test Summary</h2>
        <div className="text-sm text-blue-800">
          <p className="mb-1">
            <strong>URL Generation:</strong> {urlTests.filter(t => t.hasCorrectTag).length}/{urlTests.length} passed
          </p>
          <p className="mb-1">
            <strong>Edge Cases:</strong> {edgeTests.filter(t => t.status.includes('✅')).length}/{edgeTests.length} passed
          </p>
          <p>
            <strong>Tag Verification:</strong> All generated URLs must include 'tag=cypruspets20-20' parameter
          </p>
        </div>
      </section>
    </div>
  );
}

export default AffiliateUrlTest;

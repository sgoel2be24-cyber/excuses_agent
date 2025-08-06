document.addEventListener('DOMContentLoaded', function() {
    const problemInput = document.getElementById('problem');
    const generateBtn = document.getElementById('generateBtn');
    const excuseOutput = document.getElementById('excuseOutput');
    const copyBtn = document.getElementById('copyBtn');
    const closeBtn = document.querySelector('.close-btn');
    const lovableBrand = document.querySelector('.lovable-brand');

    // Generate excuse function
    async function generateExcuse() {
        const problem = problemInput.value.trim();
        
        if (!problem) {
            alert('Please describe what you messed up!');
            return;
        }

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="loading"></span> Generating...';
        excuseOutput.innerHTML = '<p class="placeholder">Generating your excuse...</p>';
        copyBtn.style.display = 'none';

        try {
            const response = await fetch('/api/generate-excuse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ problem })
            });

            const data = await response.json();

            if (response.ok) {
                excuseOutput.innerHTML = `<p>${data.excuse}</p>`;
                copyBtn.style.display = 'block';
            } else {
                excuseOutput.innerHTML = '<p class="placeholder">Error: ' + (data.error || 'Failed to generate excuse') + '</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            excuseOutput.innerHTML = '<p class="placeholder">Error: Failed to connect to server</p>';
        } finally {
            // Reset button state
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Excuse';
        }
    }

    // Copy to clipboard function
    function copyToClipboard() {
        const excuseText = excuseOutput.querySelector('p');
        if (excuseText && !excuseText.classList.contains('placeholder')) {
            navigator.clipboard.writeText(excuseText.textContent).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.style.background = '#218838';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '#28a745';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard');
            });
        }
    }

    // Event listeners
    generateBtn.addEventListener('click', generateExcuse);
    
    problemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateExcuse();
        }
    });

    copyBtn.addEventListener('click', copyToClipboard);

    // Close lovable brand
    closeBtn.addEventListener('click', function() {
        lovableBrand.style.display = 'none';
    });

    // Focus on input when page loads
    problemInput.focus();
}); 
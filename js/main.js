
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  setTimeout(() => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  }, 100);
});


const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distanceX = x - centerX;
    const distanceY = y - centerY;
    
    el.style.transform = `translate(${distanceX / 4}px, ${distanceY / 4}px)`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});


const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-badge, .nav-link, .link-icon, .social-icon, .filter-btn');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
    cursorFollower.classList.add('active');
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
    cursorFollower.classList.remove('active');
  });
});


document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#4cc9f0"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.3,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#4cc9f0",
          "opacity": 0.2,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  }
});


function createFloatingElements() {
  const container = document.getElementById('floatingElements');
  for (let i = 0; i < 15; i++) {
    const element = document.createElement('div');
    element.className = 'floating-element';
    
   
    const size = Math.random() * 100 + 50;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.2 + 0.05;
    
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.left = `${posX}%`;
    element.style.top = `${posY}%`;
    element.style.animationDuration = `${duration}s`;
    element.style.animationDelay = `${delay}s`;
    element.style.opacity = opacity;
    
    if (Math.random() > 0.5) {
      element.style.borderRadius = '50%';
    }
    
    container.appendChild(element);
  }
}

window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');
  
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  if (window.scrollY > 300) {
    backToTop.classList.add('active');
  } else {
    backToTop.classList.remove('active');
  }
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      
      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        location.hash = targetId;
      }
    }
  });
});


document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = form.querySelector('#btnText');
    const formStatus = document.getElementById('formStatus');
    
    // Disable button during submission
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    
    // Clear previous status messages
    formStatus.innerHTML = '';
    formStatus.className = 'mt-3';
    
    // Basic client-side validation
    if (!form.checkValidity()) {
        form.reportValidity();
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        return;
    }
    
    // Prepare form data
    const formData = new FormData(form);
    
    // Send to StaticForms
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Success message
            formStatus.className = 'mt-3 alert alert-success';
            formStatus.innerHTML = 'Message sent successfully! We\'ll get back to you soon.';
            form.reset();
            
            // Optional: Redirect if specified in the form
            if (form.redirectTo && form.redirectTo.value) {
                setTimeout(() => {
                    window.location.href = form.redirectTo.value;
                }, 2000);
            }
        } else {
            // API returned success:false
            formStatus.className = 'mt-3 alert alert-danger';
            formStatus.innerHTML = 'Error: ' + (data.message || 'Failed to send message');
        }
    })
    .catch(error => {
        // Network or other errors
        formStatus.className = 'mt-3 alert alert-danger';
        formStatus.innerHTML = 'There was a problem sending your message. Please try again later.';
        console.error('Error:', error);
    })
    .finally(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
    });
});


document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.querySelector('.form-icon').style.color = '#0d6efd'; // Bootstrap primary color
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.querySelector('.form-icon').style.color = '#6c757d'; // Bootstrap secondary color
    });
});

function initTypingAnimation() {
  const typed = new Typed('.typing-text', {
    strings: [
      'Full Stack Developer',
      'AI Specialist',
      'UI/UX Designer',
      'Problem Solver',
      'Tech Enthusiast'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  });
}


function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      
      filterBtns.forEach(b => b.classList.remove('active'));
      
      
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}


function animateOnScroll() {
  const elements = document.querySelectorAll('.section-title, .about-img, .about-content, .project-card, .contact-info, .contact-form, .timeline-item, .testimonial-card');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementPosition < windowHeight - 100) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  createFloatingElements();
  initTypingAnimation();
  initProjectsFilter();
  
  const animatedElements = document.querySelectorAll('.section-title, .about-img, .about-content, .project-card, .contact-info, .contact-form, .timeline-item, .testimonial-card');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
  });
  
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, 500);
  });
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); 
});

const nameHighlight = document.querySelector('.name-highlight');
nameHighlight.addEventListener('mouseenter', () => {
  cursor.style.transform = 'translate(-50%, -50%) scale(2)';
  cursor.style.backgroundColor = 'transparent';
  cursor.style.border = '2px solid white';
});

nameHighlight.addEventListener('mouseleave', () => {
  cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  cursor.style.backgroundColor = 'var(--accent)';
  cursor.style.border = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
// Initialize EmailJS with your credentials
(function() {
  emailjs.init("M7Wb9judvJuQ2cZRn"); // Your public key
})();

// Modified form submission handler for EmailJS
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText = form.querySelector('#btnText');
  const formStatus = document.getElementById('formStatus');
  
  // Disable button during submission
  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';
  
  // Clear previous status messages
  formStatus.innerHTML = '';
  formStatus.className = 'mt-3';
  
  // Basic client-side validation
  if (!form.checkValidity()) {
    form.reportValidity();
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';
    return;
  }
  
  // First send the message to you (using template_qzgttb8)
  emailjs.sendForm('service_rqkh5ys', 'template_qzgttb8', form)
    .then(function(response) {
      console.log('Message to you sent:', response.status, response.text);
      
      // Then send the auto-reply (using template_2tzr8pi)
      return emailjs.send('service_rqkh5ys', 'template_2tzr8pi', {
        user_name: form.user_name.value,
        user_email: form.user_email.value,
        subject: form.subject.value
      });
    })
    .then(function(response) {
      console.log('Auto-reply sent:', response.status, response.text);
      
      // Success message
      formStatus.className = 'mt-3 alert alert-success';
      formStatus.innerHTML = 'Message sent successfully! You should receive an auto-reply shortly.';
      form.reset();
    })
    .catch(function(error) {
      // Error message
      formStatus.className = 'mt-3 alert alert-danger';
      formStatus.innerHTML = 'Message sent successfully! You should receive an auto-reply shortly.';
      console.error('EmailJS Error:', error);
    })
    .finally(function() {
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
    });
});
});
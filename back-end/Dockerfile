FROM mambaorg/micromamba
# Install Apache and mod_wsgi

USER root
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y apache2 libstdc++6 apache2-dev

ENV BASH_ENV ~/.bashrc
SHELL ["/bin/bash", "-c"]

COPY ./environment.yml /home/env/
RUN micromamba create -y -f /home/env/environment.yml
RUN micromamba clean --dry-run --all \
    && find /opt/conda/ -follow -type f -name '*.a' -delete \
    && find /opt/conda/ -follow -type f -name '*.pyc' -delete \
    && find /opt/conda/ -follow -type f -name '*.js.map' -delete 

RUN echo "micromamba activate pyimagej" >> ~/.bashrc
ENV PATH /opt/conda/envs/pyimagej/bin/python3:$PATH

ENV CONDA_DEFAULT_ENV $(head -1 environment.yml | cut -d' ' -f2)

COPY ./start_apache.sh .
COPY ./configurations/ /etc/apache2/
COPY ./serverFunctionality/ /var/www/html/flask/
COPY ./serverFunctionality/static/assets/img/fiji-logo.svg /var/www/html/flask/static/fiji-logo/

# Expose port 80
EXPOSE 80
ENV WEBADDRESS bda.as.kent.edu

# Start Apache when the container starts
CMD ["./start_apache.sh"]